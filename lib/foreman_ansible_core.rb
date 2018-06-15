begin
  require 'foreman_tasks_core'
  require 'foreman_remote_execution_core'
# rubocop:disable Lint/HandleExceptions
rescue LoadError
  # These gems are not available in a proxy SCLed context
  # puts 'Running Foreman Ansible Core in non-SCL context'
end
# rubocop:enable Lint/HandleExceptions

# Core actions for Foreman Ansible, used by both Foreman and Foreman proxy
# This comprises running playbooks for the moment
module ForemanAnsibleCore
  require 'foreman_ansible_core/exception'
  require 'foreman_ansible_core/roles_reader'
  require 'foreman_ansible_core/version'

  if defined? ForemanTasksCore
    extend ForemanTasksCore::SettingsLoader
    register_settings(:ansible, :ansible_dir => Dir.home,
                                :working_dir => nil)

    if ForemanTasksCore.dynflow_present?
      require 'foreman_tasks_core/runner'
      require 'foreman_ansible_core/playbook_runner'
      require 'foreman_ansible_core/actions'
    end
  end

  if defined? ForemanTasksCore
    require 'foreman_remote_execution_core/actions'
    require 'foreman_ansible_core/remote_execution_core/ansible_runner'
    require 'foreman_ansible_core/remote_execution_core/settings_override'
    ForemanRemoteExecutionCore::Actions::RunScript.send(
      :prepend,
      ForemanAnsibleCore::RemoteExecutionCore::SettingsOverride
    )
  end
end
