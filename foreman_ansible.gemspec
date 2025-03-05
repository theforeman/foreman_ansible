# frozen_string_literal: true

require File.expand_path('lib/foreman_ansible/version', __dir__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_ansible'
  s.version     = ForemanAnsible::VERSION
  s.authors     = ['Daniel Lobato Garcia']
  s.email       = ['elobatocs@gmail.com']
  s.homepage    = 'https://github.com/theforeman/foreman_ansible'
  s.summary     = 'Ansible integration with Foreman (theforeman.org)'
  s.description = 'Ansible integration with Foreman'
  s.licenses    = ['GPL-3.0']

  s.files = Dir['{app,config,db,lib/foreman_ansible,locale,webpack}/**/*'] +
            ['lib/foreman_ansible.rb', 'LICENSE', 'Rakefile', 'README.md'] +
            ['package.json']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'acts_as_list', '~> 1.2'
  s.add_dependency 'deface', '< 2.0'
  s.add_dependency 'foreman_remote_execution', '>= 14.0', '< 16'
  s.add_dependency 'foreman-tasks', '>= 10.0', '< 11'

  s.add_development_dependency 'theforeman-rubocop', '~> 0.1.0'
end
