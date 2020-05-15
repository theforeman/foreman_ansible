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
            ).to_hash,
            :verbosity_level => Setting[:ansible_verbosity],
            :remote_execution_command => ansible_command?(
              template_invocation.template
            ),
            :name => host.name
          )
        end

        def secrets(host)
          {
            'per-host' => {
              host.name => {
                'ansible_ssh_pass' => rex_ssh_password(host),
                'ansible_sudo_pass' => rex_sudo_password(host)
              }
            }
          }
        end

        def rex_ssh_password(host)
          host_setting(host, 'remote_execution_ssh_password')
        end

        def rex_sudo_password(host)
          host_setting(host, 'remote_execution_sudo_password')
        end

        def host_setting(host, setting)
          host.params[setting.to_s] || Setting[setting]
        end

        def supports_effective_user?
          true
        end

        def proxy_operation_name
          'ansible-runner'
        end

        def required_proxy_selector_for(template)
          if template.remote_execution_features.where(:label => 'ansible_run_capsule_upgrade').any?
            ::DefaultProxyProxySelector.new
          else
            super
          end
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
