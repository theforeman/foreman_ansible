# Foreman Ansible :arrow_forward:

## Features
* Import facts
* Monitor playbook and ansible runs runtime
* Sends Ansible reports to Foreman that contain what changed on your system after an ansible run.

## Basic usage

Install `foreman_ansible` on your Foreman host. See the [Foreman manual: installing plugin from gems](http://www.theforeman.org/plugins/#2.3AdvancedInstallationfromGems)

Deploy `extras/foreman_callback.py` as a callback on your Ansible installation. For instance, put in your `ansible.cfg`:

```
callback_plugins = ~/.ansible/plugins/callback_plugins/
bin_ansible_callbacks = True
```
And copy `extras/foreman_callback.py` from this repo to `~/.ansible/plugins/callback_plugins/`.

You can configure it via the following environment variables:

* FOREMAN_URL: the URL of your Foreman installation (default "http://localhost:3000")
* FOREMAN_SSL_CERT: The public key when using SSL client certificates (default "/etc/foreman/client_cert.pem")
* FOREMAN_SSL_KEY: The private key when using SSL client certificates (default  "/etc/foreman/client_key.pem")
* FOREMAN_SSL_VERIFY: wether to verify SSL certificates. Use *False*
  to disable certificate checks. You can also set it to CA bundle (default is "True").

See the [python-requests documentation](http://docs.python-requests.org/en/master/user/advanced/#ssl-cert-verification) on the details of certificate setup.

That's it!

Now, every time you run a playbook or  `ansible -m setup $HOSTNAME`, Ansible will automatically submit facts and a small report for $HOSTNAME to Foreman. See 'Extra information' below if you find any error.

##### Registering a new host in Foreman
![sign up gif](http://i.imgur.com/mlnVFJj.gif)

##### Host with failed and successful reports
![reports](http://i.imgur.com/1ySO4sh.png)

### Extra information

In Foreman, you should add whatever Ansible hosts you want to submit facts from to the setting `trusted_puppetmaster_hosts`. Change it at Administer > Settings, Puppet tab.

If the Foreman setting 'create_new_host_when_facts_are_uploaded' is true, and $HOSTNAME doesn't exist in Foreman, it will autocreate that host in Foreman. If it already exists, it will update the facts.

Similarly, the Foreman setting 'ignore_puppet_facts_for_provisioning' is set to false, facts related to interfaces will update the interfaces of $HOSTNAME in Foreman.

### Devs

The callback sends a POST request to /api/v2/hosts/facts with the format you can see [in the API docs](http://theforeman.org/api/1.9/apidoc/v2/hosts/facts.html).

Facts must contain the output of `ansible -m setup $HOSTNAME`, plus a '_type' and '_timestamp' keys. You can see an example on test/fixtures/sample_facts.json in this repository.

After that request, you should have a host registered in Foreman with the Ansible facts. It takes into account some facter and ohai facts if these are available on the system as well.

## Contributing

Fork and send a Pull Request. Thanks!

## Copyright

Copyright (c) Daniel Lobato Garcia

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.



