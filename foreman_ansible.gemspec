require File.expand_path('../lib/foreman_ansible/version', __FILE__)
require 'date'

Gem::Specification.new do |s|
  s.name        = 'foreman_ansible'
  s.version     = ForemanAnsible::VERSION
  s.authors     = ['Daniel Lobato Garcia']
  s.email       = ['elobatocs@gmail.com']
  s.homepage    = 'https://github.com/theforeman/foreman_ansible'
  s.summary     = 'Ansible integration with Foreman (theforeman.org)'
  s.description = 'Ansible integration with Foreman'
  s.licenses    = ['GPL-3']

  s.files = Dir['{app,config,db,lib,locale}/**/*'] +
            ['LICENSE', 'Rakefile', 'README.md']
  s.test_files = Dir['test/**/*']

  s.add_development_dependency 'rubocop'
end
