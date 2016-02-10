#!/usr/bin/python
# vim: set fileencoding=utf-8 :
# Copyright (C) 2016 Guido Günther <agx@sigxcpu.org>
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program; if not, please see
#    <http://www.gnu.org/licenses/>
# END OF COPYRIGHT #

import re
from setuptools import setup


def fetch_version():
    """Get version from version.rb"""
    version = "0.0"
    version_re = re.compile(".*VERSION\s*=\s*'([0-9\.]+)'\s*$")

    with open("lib/foreman_ansible/version.rb") as f:
        for line in f:
            m = version_re.match(line)
            if m:
                version = m.group(1)
                break
        else:
            raise Exception("Could not determine version")

    return version


setup(name = "foreman_ansible",
      version = fetch_version(),
      author = u'Daniel Lobato Garcia',
      author_email = 'elobatocs@gmail.com',
      url = 'https://github.com/theforeman/foreman_ansible',
      description = 'Ansible hook to publish report to the Foreman',
      license = 'GPLv3+',
      classifiers = [
          'Environment :: Console',
          'Programming Language :: Python :: 2',
          'Topic :: Software Development :: Version Control :: Git',
          'Operating System :: POSIX :: Linux',
      ],
      scripts = ['extras/foreman_callback.py'],
)
