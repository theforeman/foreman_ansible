require 'foreman_tasks_core'

# Core parts for the Foreman Ansinble, usable by both Foreman and
# Foreman proxy
module ForemanAnsibleCore
  extend ForemanTasksCore::SettingsLoader
  register_settings(:ansible, :ansible_dir => '/etc/ansible',
                              :working_dir => nil)

  if ForemanTasksCore.dynflow_present?
    require 'foreman_tasks_core/runner'
    require 'foreman_ansible_core/playbook_runner'
    require 'foreman_ansible_core/actions'
  end

  require 'foreman_ansible_core/version'
end
