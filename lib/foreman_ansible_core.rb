# frozen_string_literal: true

require 'foreman_tasks_core'
require 'foreman_remote_execution_core'

# Core actions for Foreman Ansible, used by both Foreman and Foreman proxy
# This comprises running playbooks for the moment
module ForemanAnsibleCore
  require 'foreman_ansible_core/exception'
  require 'foreman_ansible_core/version'

  extend ForemanTasksCore::SettingsLoader
  register_settings(:ansible, :ansible_dir => Dir.home,
                              :working_dir => nil)

  if ForemanTasksCore.dynflow_present?
    require 'foreman_tasks_core/runner'
    require 'foreman_ansible_core/runner/playbook'
    require 'foreman_ansible_core/runner/ansible_runner'
    require 'foreman_ansible_core/actions'
  end

  require 'foreman_remote_execution_core/actions'
  require 'foreman_ansible_core/remote_execution_core/ansible_runner'
  require 'foreman_ansible_core/task_launcher/playbook'
  require 'foreman_ansible_core/task_launcher/ansible_runner'

  if defined?(SmartProxyDynflowCore)
    SmartProxyDynflowCore::TaskLauncherRegistry.register('ansible-runner',
                                                         ForemanAnsibleCore::TaskLauncher::AnsibleRunner)
    SmartProxyDynflowCore::TaskLauncherRegistry.register('ansible-playbook',
                                                         ForemanAnsibleCore::TaskLauncher::Playbook)
  end
end
