# frozen_string_literal: true

class Setting
  # Provide settings related with Ansible
  class Ansible < ::Setting
    class << self
      # It would be more disadvantages than advantages to split up
      # default_settings into multiple methods, this way it's already very
      # manageable.
      # rubocop:disable AbcSize
      # rubocop:disable MethodLength
      def default_settings
        [
          set(
            'ansible_ssh_private_key_file',
            N_('Use this to supply a path to an SSH Private Key '\
               'that Ansible will use in lieu of a password '\
               'Override with "ansible_ssh_private_key_file" '\
               'host parameter'),
            '',
            N_('Private Key Path')
          ),
          set(
            'ansible_connection',
            N_('Use this connection type by default when running '\
               'Ansible playbooks. You can override this on hosts by '\
               'adding a parameter "ansible_connection"'),
            'ssh',
            N_('Connection type')
          ),
          set(
            'ansible_winrm_server_cert_validation',
            N_('Enable/disable WinRM server certificate '\
               'validation when running Ansible playbooks. You can override '\
               'this on hosts by adding a parameter '\
               '"ansible_winrm_server_cert_validation"'),
            'validate',
            N_('WinRM cert Validation')
          ),
          set(
            'ansible_verbosity',
            N_('Foreman will add this level of verbosity for '\
               'additional debugging output when running Ansible playbooks.'),
            '0',
            N_('Default verbosity level'),
            nil,
            :collection => lambda do
              { '0' => N_('Disabled'),
                '1' => N_('Level 1 (-v)'),
                '2' => N_('Level 2 (-vv)'),
                '3' => N_('Level 3 (-vvv)'),
                '4' => N_('Level 4 (-vvvv)') }
            end
          ),
          set(
            'ansible_post_provision_timeout',
            N_('Timeout (in seconds) to set when Foreman will trigger a '\
               'play Ansible roles task after a host is fully provisioned. '\
               'Set this to the maximum time you expect a host to take '\
               'until it is ready after a reboot.'),
            '360',
            N_('Post-provision timeout')
          ),
          set(
            'ansible_interval',
            N_('Timeout (in minutes) when hosts should have reported.'),
            '30',
            N_('Ansible report timeout')
          ),
          set(
            'ansible_out_of_sync_disabled',
            format(N_('Disable host configuration status turning to out of'\
               ' sync for %{cfgmgmt} after report does not arrive within'\
               ' configured interval'), :cfgmgmt => 'Ansible'),
            false,
            format(N_('%{cfgmgmt} out of sync disabled'),
                   :cfgmgmt => 'Ansible')
          ),
          set(
            'ansible_inventory_template',
            N_('Foreman will use this template to schedule the report '\
               'with Ansible inventory'),
            'Ansible Inventory',
            N_('Default Ansible inventory report template')
          )
        ]
      end
      # rubocop:enable AbcSize
      # rubocop:enable MethodLength

      def load_defaults
        Setting::BLANK_ATTRS.push('ansible_ssh_private_key_file')
        super
      end

      def humanized_category
        N_('Ansible')
      end
    end
  end
end
