import os
from datetime import datetime
import json
import uuid
import requests

FOREMAN_URL = 'http://localhost:3000'
FOREMAN_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
TIME_FORMAT="%Y-%m-%d_%H%M%S_%f"
FILE_NAME_FORMAT="%(now)s-%(host)s.json"
MSG_FORMAT='{"name":"%(host)s","_timestamp":"%(now)s","category":"%(category)s", "facts": %(data)s}' + "\n"
LOG_DIR="/tmp/ansible/events"
AGGREGATION_KEY = uuid.uuid4().hex

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

class CallbackModule(object):

    """
    logs playbook results, per host, in LOG_DIR
    sends request to Foreman with ansible setup module facts
    """

    def log(self, host, category, data):
        if type(data) != dict:
            data = dict(msg=data)
        if not 'ansible_facts' in data:
            return
        data["_type"] = "ansible"
        data = json.dumps(data)
        dir_path = os.path.join(LOG_DIR, AGGREGATION_KEY)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        now = datetime.now().strftime(TIME_FORMAT)
        path = os.path.join(dir_path, FILE_NAME_FORMAT % dict(now=now, host=host))
        facts_json = MSG_FORMAT % dict(host=host, now=now, category=category, data=data)
        fd = open(path, "w")
        fd.write(facts_json)
        fd.close()
        requests.post(url=FOREMAN_URL + '/api/v2/hosts/facts',
                      data=facts_json,
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

