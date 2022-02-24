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

        def provider_input_namespace
          :ansible
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
            :name => host.name,
            :check_mode => host.host_param('ansible_roles_check_mode'),
            :cleanup_working_dirs => cleanup_working_dirs?(host)
          )
        end

        def secrets(host)
          {
            :key_passphrase => Setting[:remote_execution_ssh_key_passphrase],
            'per-host' => {
              host.name => {
                'ansible_password' => rex_ssh_password(host),
                'ansible_become_password' => rex_effective_user_password(host)
              }
            }
          }
        end

        def rex_ssh_password(host)
          host_setting(host, 'remote_execution_ssh_password')
        end

        def rex_effective_user_password(host)
          host_setting(host, 'remote_execution_effective_user_password')
        end

        def supports_effective_user?
          true
        end

        def provider_inputs
          [
            ForemanRemoteExecution::ProviderInput.new(
              name: 'tags',
              label: _('Tags'),
              value: '',
              value_type: 'plain',
              description: 'Tags used for Ansible execution'
            ),
            ForemanRemoteExecution::ProviderInput.new(
              name: 'tags_flag',
              label: _('Include/Exclude Tags'),
              value: 'include',
              description: 'Option whether to include or exclude tags',
              options: "include\nexclude"
            )
          ]
        end

        def provider_inputs_doc
          opts = provider_inputs.find { |input| input.name == 'tags_flag' }.options.split("\n")
          {
            :namespace => provider_input_namespace,
            :opts => { :desc => N_('Ansible provider specific inputs') },
            :children => [
              {
                :name => :tags,
                :type => String,
                :opts => { :required => false, :desc => N_('A comma separated list of tags to use for Ansible run') }
              },
              {
                :name => :tags_flag,
                :type => opts,
                :opts => { :required => false, :desc => N_('Include\Exclude tags for Ansible run') }
              }
            ]
          }
        end

        def proxy_command_provider_inputs(template_invocation)
          tags = template_invocation.provider_input_values.find_by(:name => 'tags')&.value || ''
          tags_flag = template_invocation.provider_input_values.find_by(:name => 'tags_flag')&.value || ''
          { :tags => tags, :tags_flag => tags_flag }
        end

        def proxy_operation_name
          'ansible-runner'
        end

        def proxy_action_class
          'Proxy::Ansible::TaskLauncher::Playbook::PlaybookRunnerAction'
        end

        def proxy_batch_size
          value = Setting['foreman_ansible_proxy_batch_size']
          value.presence && value.to_i
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
