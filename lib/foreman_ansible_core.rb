require 'foreman_tasks_core'

# Core actions for Foreman Ansible, used by both Foreman and Foreman proxy
# This comprises running playbooks for the moment
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
