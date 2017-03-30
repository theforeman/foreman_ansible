require File.expand_path('../lib/foreman_ansible_core/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_ansible_core'
  s.version     = ForemanAnsibleCore::VERSION
  s.authors     = ['Daniel Lobato Garcia']
  s.email       = ['elobatocs@gmail.com']
  s.homepage    = 'https://github.com/theforeman/foreman_ansible'
  s.summary     = 'Ansible integration with Foreman (theforeman.org): core bits'
  s.description = <<DESC
Ansible integration with Foreman - core parts for dealing with Ansible concepts,
usable by foreman_ansible or smart_proxy_ansible to delegate the execution.
DESC
  s.licenses    = ['GPL-3.0']

  s.files = Dir['lib/foreman_ansible_core/**/*', 'LICENSE'] +
            ['lib/foreman_ansible_core.rb', 'bin/json_inventory.sh']

  s.add_development_dependency 'rubocop', '~> 0.42'
  s.add_dependency 'foreman-tasks-core', '~> 0.1'
end
