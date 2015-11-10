import os
from datetime import datetime
from collections import defaultdict
import json
import uuid
import requests

FOREMAN_URL = "http://localhost:3000"
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
    "logs" : [{ "log" : %(log)s }]
  }
}
"""

class CallbackModule(object):

    """
    Sends Ansible facts (if ansible -m setup ran) and reports
    """

    def log(self, host, category, data):
        if type(data) != dict:
            data = dict(msg=data)
        data['category'] = category
        if 'ansible_facts' in data:
            self.send_facts(host, data)
        self.send_report(host, data)


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
                      verify=False)

    def send_report(self, host, data):
        """
        Send reports to Foreman, to be parsed by Foreman config report
        importer.  I massage the data get a report json that Foreman
        can handle without writing another report importer.

        Currently it just sets the status. It's missing:
          - metrics, which we can get from data, except for runtime
          - proper count for playbook tasks, currently it's 1 no
            matter how many modules have run
        """


        status = defaultdict(lambda:0)
        log = { 'messages' : { 'message' : '' },
                'sources' :  { 'source' : ''} }
        if 'msg' in data:
          log['messages']['message'] += (data['msg'] + ' ')
        if 'results' in data:
          log['messages']['message'] += json.dumps(data['results'])
        if 'invocation' in data:
          log['sources']['source'] = data['invocation']['module_name'] + ' ' + data['invocation']['module_args']
        failed_report_category = ["FAILED", "UNREACHABLE", "ASYNC_FAILED"]
        success_report_category = ["OK", "SKIPPED", "ASYNC_OK"]
#       Set runtime if this comes from Ansible setup, other modules we can't test.
#        if 'ansible_facts' in data:
#            metrics['time'] = {'total': }
        if 'category' in data and data["category"] in failed_report_category:
            status["failed"] = 1
            log['level'] = 'err'
        if 'category' in data and data["category"] in success_report_category:
            status["applied"] = 1
            log['level'] = 'notice'
        if 'changed' in data and data["changed"] == "True":
            status["changed"] = 1
        report_json = REPORT_FORMAT % dict(host=host,
            now=datetime.now().strftime(TIME_FORMAT),
            metrics=json.dumps(data),
            status=json.dumps(status),
            log=json.dumps(log))
#       To be changed to /api/v2/config_reports in 1.11.
#       Maybe we could make a GET request to get the Foreman version & do this
#       automatically.
        requests.post(url=FOREMAN_URL + '/api/v2/reports',
                      data=report_json,
                      headers=FOREMAN_HEADERS,
                      verify=False)

    def on_any(self, *args, **kwargs):
        pass

    def runner_on_failed(self, host, res, ignore_errors=False):
        self.log(host, 'FAILED', res)

    def runner_on_ok(self, host, res):
        self.log(host, 'OK', res)

    def runner_on_skipped(self, host, item=None):
        self.log(host, 'SKIPPED', '...')

    def runner_on_unreachable(self, host, res):
        self.log(host, 'UNREACHABLE', res)

    def runner_on_no_hosts(self):
        pass

    def runner_on_async_poll(self, host, res, jid, clock):
        pass

    def runner_on_async_ok(self, host, res, jid):
        self.log(host, 'ASYNC_OK', res)

    def runner_on_async_failed(self, host, res, jid):
        self.log(host, 'ASYNC_FAILED', res)

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
        self.log(host, 'IMPORTED', imported_file)

    def playbook_on_not_import_for_host(self, host, missing_file):
        self.log(host, 'NOTIMPORTED', missing_file)

    def playbook_on_play_start(self, name):
        pass

    def playbook_on_stats(self, stats):
        pass

