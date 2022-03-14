# frozen_string_literal: true

# Tests
namespace :test do
  desc 'Foreman Ansible plugin tests'
  Rake::TestTask.new(:foreman_ansible) do |t|
    test_dir = File.join(__dir__, '..', '..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.test_files = [Rails.root.join('test/unit/foreman/access_permissions_test.rb')]
    t.verbose = false
    t.warning = false
  end
end

namespace :foreman_ansible do
  begin
    require 'rubocop/rake_task'
    RuboCop::RakeTask.new(:rubocop) do |task|
      task.patterns = ["#{ForemanAnsible::Engine.root}/app/**/*.rb",
                       "#{ForemanAnsible::Engine.root}/lib/**/*.rb",
                       "#{ForemanAnsible::Engine.root}/test/**/*.rb"]
    end
  rescue LoadError => e
    raise e unless Rails.env.production?
  end
end

Rake::Task[:test].enhance ['test:foreman_ansible']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_ansible',
                                      'foreman_ansible:rubocop']
end
