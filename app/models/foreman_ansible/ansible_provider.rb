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
            'ansible_inventory' =>
              ::ForemanAnsible::InventoryCreator.new([host]).to_hash.to_json
          )
        end
      end
    end
  end
end
