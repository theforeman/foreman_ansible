require 'foreman_tasks_core'

# Core actions for Foreman Ansible, used by both Foreman and Foreman proxy
# This comprises running playbooks for the moment
module ForemanAnsibleCore
  extend ForemanTasksCore::SettingsLoader
  register_settings(:ansible, :ansible_dir => '/etc/ansible',
                              :working_dir => nil)
  require 'foreman_ansible_core/exception'

  if ForemanTasksCore.dynflow_present?
    require 'foreman_tasks_core/runner'
    require 'foreman_ansible_core/playbook_runner'
    require 'foreman_ansible_core/actions'
  end

  if defined? ForemanRemoteExecutionCore
    require 'foreman_remote_execution_core/actions'
    require 'foreman_ansible_core/remote_execution_core/ansible_runner'
    require 'foreman_ansible_core/remote_execution_core/settings_override'
    ForemanRemoteExecutionCore::Actions::RunScript.send(
      :prepend,
      ForemanAnsibleCore::RemoteExecutionCore::SettingsOverride
    )
  end

  require 'foreman_ansible_core/roles_reader'
  require 'foreman_ansible_core/version'
end
