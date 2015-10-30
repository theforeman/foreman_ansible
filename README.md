# Foreman Ansible

[Foreman](http://theforeman.org) integration with Ansible. For now, it's just importing facts and not meant for general use.

## Usage

Send a POST request to /api/v2/hosts/facts with the format you can see [in the API docs](http://theforeman.org/api/1.9/apidoc/v2/hosts/facts.html).

Facts must contain the output of `ansible -m setup $HOSTNAME`, plus a '_type' and '_timestamp' top level keys. You can see an example on test/fixtures/sample_facts.json in this repository.

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
