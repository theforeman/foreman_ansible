require 'foreman_remote_execution'

module ForemanAnsible
  # Dependencies related with the remote execution plugin
  class Engine < ::Rails::Engine
    config.to_prepare do
      RemoteExecutionProvider.register(
        :Ansible,
        ForemanAnsible::AnsibleProvider
      )
    end

    def self.register_rex_feature
      RemoteExecutionFeature.register(
        :ansible_run_host,
        N_('Ansible: Run host roles'),
        :description => N_('Runs an Ansible playbook which contains all'\
                           ' the roles defined for a host')
      )
    end
  end
end
