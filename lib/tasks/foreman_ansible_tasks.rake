# Tests
namespace :test do
  desc 'Test ForemanAnsible'
  Rake::TestTask.new(:foreman_ansible) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = false
    t.warning = false
  end
end

namespace :foreman_ansible do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_ansible) do |task|
        task.patterns = ["#{ForemanAnsible::Engine.root}/app/**/*.rb",
                         "#{ForemanAnsible::Engine.root}/lib/**/*.rb",
                         "#{ForemanAnsible::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_ansible'].invoke
  end

  task :update_roles, [:proxy] => [:environment] do |task, args|
    require 'foreman_ansible/update_roles'
    puts 'Updating Ansible Roles, from #{args[:proxy] ? args[:proxy] : Foreman host} please wait...'
    migration = ForemanAnsible::UpdateRoles.new(args[:proxy])
    abort('Foreman and proxy with Ansible feature should be up for this migration') unless migration.has_available_proxy?
    migration.run
    puts 'Migration successfully finished.'
  end
end

Rake::Task[:test].enhance ['test:foreman_ansible']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_ansible',
                                      'foreman_ansible:rubocop']
end
