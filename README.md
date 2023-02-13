[![Code Climate](https://codeclimate.com/github/theforeman/foreman_ansible/badges/gpa.svg)](https://codeclimate.com/github/theforeman/foreman_ansible)
[![Gem Version](https://badge.fury.io/rb/foreman_ansible.svg)](https://badge.fury.io/rb/foreman_ansible)
[![GPL License](https://img.shields.io/github/license/theforeman/foreman_ansible.svg)](https://github.com/theforeman/foreman_ansible/blob/master/LICENSE)

# Foreman Ansible :arrow_forward:

Reporting and facts import from Ansible to Foreman.

* Main website: [theforeman.org](https://theforeman.org)
* Plugin manual: [foreman_ansible manual](https://theforeman.org/plugins/foreman_ansible)
* ServerFault tag: [Foreman](https://serverfault.com/questions/tagged/foreman)
* Issues: [foreman ansible on Redmine](https://projects.theforeman.org/projects/ansible/issues)
* Chat and forum: [https://theforeman.org/support.html](https://theforeman.org/support.html)

## Features
* Import facts
* Monitor playbook and Ansible runs runtime
* Sends Ansible reports to Foreman that contain what changed on your system after an ansible run.
* Stores a list of roles applicable to your hosts and 'plays' them
* Looking for an Ansible dynamic inventory for Foreman? Use [foreman_ansible_inventory](https://github.com/theforeman/foreman_ansible_inventory/)

## Documentation (installation and configuration)
Check out the official manual at [theforeman.org](http://theforeman.org/plugins/foreman_ansible/2.x/index.html)

##### Registering a new host in Foreman
![sign up gif](http://i.imgur.com/mlnVFJj.gif)

##### Host with failed and successful reports
![reports](http://i.imgur.com/1ySO4sh.png)

##### Assigning roles to a host and 'playing' them
![role list](http://i.imgur.com/UyeZIq8.png)
![role play](http://i.imgur.com/eU4RENK.png)
![multiple role play](http://i.imgur.com/uoIiKJ5.png)


## Compatibility

| Foreman | Plugin |
| ---------------:| --------------:|
| >= 1.15        | 1.4             |
| >= 1.16        | 2.0             |
| >= 1.18        | 2.2             |
| >= 1.21        | 2.3             |

### Devs

The callback sends a POST request to /api/v2/hosts/facts with the format you can see [in the API docs](http://theforeman.org/api/1.20/apidoc/v2/hosts/facts.html).

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
