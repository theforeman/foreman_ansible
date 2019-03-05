# frozen_string_literal: true

if defined? ForemanRemoteExecution
  module ForemanAnsible
    # Provider for RemoteExecution that allows to run Ansible playbooks.
    # Read the source of other RemoteExecution providers for more.
    class AnsibleProvider < RemoteExecutionProvider
      class << self
        def ssh_password(host)
          host_setting(host, :remote_execution_ssh_password)
        end

        def ssh_key_passphrase(host)
          host_setting(host, :remote_execution_ssh_key_passphrase)
        end

        def humanized_name
          'Ansible'
        end

        def proxy_command_options(template_invocation, host)
          super(template_invocation, host).merge(
            'ansible_inventory' => ::ForemanAnsible::InventoryCreator.new(
              [host], template_invocation
            ).to_hash.to_json,
            :remote_execution_command => ansible_command?(
              template_invocation.template
            ),
            :name => host.name
          )
        end

        def supports_effective_user?
          true
        end

        def proxy_operation_name
          'ansible-runner'
        end

        private

        def ansible_command?(template)
          template.remote_execution_features.
            where(:label => 'ansible_run_host').empty?
        end
      end
    end
  end
end
