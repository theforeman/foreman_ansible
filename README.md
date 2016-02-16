[![Code Climate](https://codeclimate.com/github/theforeman/foreman_ansible/badges/gpa.svg)](https://codeclimate.com/github/theforeman/foreman_ansible)
[![Gem Version](https://badge.fury.io/rb/foreman_ansible.svg)](https://badge.fury.io/rb/foreman_ansible)
[![GPL License](https://img.shields.io/github/license/theforeman/foreman_ansible.svg)](https://github.com/theforeman/foreman_ansible/blob/master/LICENSE)

# Foreman Ansible :arrow_forward:

Reporting and facts import from Ansible to Foreman.

* Main website: [theforeman.org](http://theforeman.org)
* Plugin manual: [foreman_ansible manual](http://theforeman.org/plugins/foreman_ansible/0.x/index.html)
* ServerFault tag: [Foreman](http://serverfault.com/questions/tagged/foreman)
* Issues: [foreman ansible on Redmine](http://projects.theforeman.org/projects/ansible/issues)
* Community and support: [#theforeman](https://kiwiirc.com/client/irc.freenode.net/?#theforeman) for general support, [#theforeman-dev](https://kiwiirc.com/client/irc.freenode.net/?#theforeman-dev) for development chat in [Freenode](irc.freenode.net)
* Mailing lists:
    * [foreman-users](https://groups.google.com/forum/?fromgroups#!forum/foreman-users)
    * [foreman-dev](https://groups.google.com/forum/?fromgroups#!forum/foreman-dev)

## Features
* Import facts
* Monitor playbook and Ansible runs runtime
* Sends Ansible reports to Foreman that contain what changed on your system after an ansible run.
* Looking for an Ansible dynamic inventory for Foreman? Use [foreman_ansible_inventory](https://github.com/theforeman/foreman_ansible_inventory/)

## Documentation (installation and configuration)
Check out the official manual at [theforeman.org](http://theforeman.org/plugins/foreman_ansible/0.x/index.html)

##### Registering a new host in Foreman
![sign up gif](http://i.imgur.com/mlnVFJj.gif)

##### Host with failed and successful reports
![reports](http://i.imgur.com/1ySO4sh.png)

### Devs

The callback sends a POST request to /api/v2/hosts/facts with the format you can see [in the API docs](http://theforeman.org/api/1.9/apidoc/v2/hosts/facts.html).

Facts must contain the output of `ansible -m setup $HOSTNAME`, plus a '_type' and '_timestamp' keys. You can see an example on test/fixtures/sample_facts.json in this repository.

After that request, you should have a host registered in Foreman with the Ansible facts. It takes into account some facter and ohai facts if these are available on the system as well.

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
