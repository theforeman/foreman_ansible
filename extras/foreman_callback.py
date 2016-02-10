import os
from datetime import datetime
from collections import defaultdict
import json
import uuid
import requests
import time

try:
    from ansible.plugins.callback import CallbackBase
    parent_class = CallbackBase
except ImportError:
    parent_class = object

FOREMAN_URL = os.getenv('FOREMAN_URL', "http://localhost:3000")
# Substitute by a real SSL certificate and key if your Foreman uses HTTPS
FOREMAN_SSL_CERT = (os.getenv('FOREMAN_SSL_CERT', "/etc/foreman/client_cert.pem"),
                    os.getenv('FOREMAN_SSL_KEY', "/etc/foreman/client_key.pem"))
FOREMAN_SSL_VERIFY = os.getenv('FOREMAN_SSL_VERIFY', True)
FOREMAN_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}
TIME_FORMAT="%Y-%m-%d %H:%M:%S %f"
FACTS_FORMAT="""
{
  "name":"%(host)s",
  "facts": %(data)s
}
"""
REPORT_FORMAT="""
{
"report":
  {
    "host":"%(host)s",
    "reported_at":"%(now)s",
    "metrics": %(metrics)s,
    "status": %(status)s,
    "logs" : %(log)s
  }
}
"""

class CallbackModule(parent_class):

    """
    Sends Ansible facts (if ansible -m setup ran) and reports
    """
    def __init__(self):
        super(CallbackModule, self).__init__()
        self.items = defaultdict(list)
        self.start_time = int(time.time())
        self.ssl_verify = self._ssl_verify()

    def log(self, host, category, data):
        if type(data) != dict:
            data = dict(msg=data)
        data['category'] = category
        if 'ansible_facts' in data:
            self.send_facts(host, data)
        self.send_report(host, data)

    def _ssl_verify(self):
        if FOREMAN_SSL_VERIFY.lower() in [ "1", "true", "on" ]:
            verify = True
        elif FOREMAN_SSL_VERIFY.lower() in [ "0", "false", "off" ]:
            requests.packages.urllib3.disable_warnings()
            self._display.warning("plugin %s: SSL verification of %s disabled" % (os.path.basename(__file__), FOREMAN_URL))
            verify = False
        else:  # Set ta a CA bundle:
            verify = FOREMAN_SSL_VERIFY
        return verify

    def send_facts(self, host, data):
        """
        Sends facts to Foreman, to be parsed by foreman_ansible fact
        parser.  The default fact importer should import these facts
        properly.
        """
        data["_type"] = "ansible"
        data["_timestamp"] = datetime.now().strftime(TIME_FORMAT)
        data = json.dumps(data)
        facts_json = FACTS_FORMAT % dict(host=host, data=data)


        requests.post(url=FOREMAN_URL + '/api/v2/hosts/facts',
                      data=facts_json,
                      headers=FOREMAN_HEADERS,
                      cert=FOREMAN_SSL_CERT,
                      verify=self.ssl_verify)


    def _build_log(self, data):
        logs = []
        for entry in data:
            if isinstance(entry, tuple):
                # v2 plugins have the task name
                source, msg = entry
            else:
                source = json.dumps(entry['invocation'])
                msg = entry
            if 'failed' in msg:
                level = 'err'
            else:
                level = 'notice' if 'changed' in msg and msg['changed'] else 'info'
            logs.append({ "log": {
                'sources'  : { 'source' : source },
                'messages' : { 'message': json.dumps(msg) },
                'level':     level
                }})
        return logs


    def send_reports(self, stats):
        """
        Send reports to Foreman, to be parsed by Foreman config report
        importer.  I massage the data get a report json that Foreman
        can handle without writing another report importer.

        Currently it just sets the status. It's missing:
          - metrics, which we can get from data, except for runtime
        """
        status = defaultdict(lambda:0)
        metrics = {}

        for host in stats.processed.keys():
            sum = stats.summarize(host)
            status["applied"] = sum['changed']
            status["failed"] = sum['failures'] + sum['unreachable']
            status["skipped"] = sum['skipped']
            log = self._build_log(self.items[host])
            metrics["time"] = { "total": int(time.time()) - self.start_time }
            self.items[host] = []

            report_json = REPORT_FORMAT % dict(host=host,
                now=datetime.now().strftime(TIME_FORMAT),
                metrics=json.dumps(metrics),
                status=json.dumps(status),
                log=json.dumps(log))
#           To be changed to /api/v2/config_reports in 1.11.
#           Maybe we could make a GET request to get the Foreman version & do this
#           automatically.
            requests.post(url=FOREMAN_URL + '/api/v2/reports',
                          data=report_json,
                          headers=FOREMAN_HEADERS,
                          cert=FOREMAN_SSL_CERT,
                          verify=self.ssl_verify)

    def on_any(self, *args, **kwargs):
        pass

    def runner_on_failed(self, host, res, ignore_errors=False):
        self.items[host].append(res)

    def runner_on_ok(self, host, res):
        if res['invocation']['module_name'] == 'setup':
            self.send_facts(host, res)
        else:
            self.items[host].append(res)

    def runner_on_skipped(self, host, item=None):
        pass

    def runner_on_unreachable(self, host, res):
        self.items[host].append(res)

    def runner_on_no_hosts(self):
        pass

    def runner_on_async_poll(self, host, res, jid, clock):
        pass

    def runner_on_async_ok(self, host, res, jid):
        self.items[host].append(res)

    def runner_on_async_failed(self, host, res, jid):
        self.items[host].append(res)

    def playbook_on_start(self):
        pass

    def playbook_on_notify(self, host, handler):
        pass

    def playbook_on_no_hosts_matched(self):
        pass

    def playbook_on_no_hosts_remaining(self):
        pass

    def playbook_on_task_start(self, name, is_conditional):
        pass

    def playbook_on_vars_prompt(self, varname, private=True, prompt=None, encrypt=None, confirm=False, salt_size=None, salt=None, default=None):
        pass

    def playbook_on_setup(self):
        pass

    def playbook_on_import_for_host(self, host, imported_file):
        pass

    def playbook_on_not_import_for_host(self, host, missing_file):
        pass

    def playbook_on_play_start(self, name):
        pass

    def playbook_on_stats(self, stats):
        self.send_reports(stats)

    # v2 callback API
    def v2_runner_on_ok(self, result):
        res = result._result
        host = result._host.get_name()
        try:
            module = res['invocation']['module_name']
        except KeyError:
            module = None
        if module == 'setup':
            self.send_facts(host, res)
        else:
            name = result._task.get_name()
            self.items[host].append((name, res))

    def v2_runner_on_failed(self, result, ignore_errors=False):
        name = result._task.get_name()
        host = result._host.get_name()
        self.items[host].append((name, result._result))
