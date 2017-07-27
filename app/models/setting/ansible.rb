class Setting
  # Provide settings related with Ansible
  class Ansible < ::Setting
    class << self
      # It would be more disadvantages than advantages to split up
      # load_defaults into multiple methods, this way it's already very
      # manageable.
      # rubocop:disable AbcSize
      # rubocop:disable MethodLength
      # rubocop:disable BlockLength
      def load_defaults
        return unless super
        transaction do
          [
            set(
              'ansible_port',
              N_('Use this port to connect to hosts '\
                 'and run Ansible. You can override this on hosts '\
                 'by adding a parameter "ansible_port"'),
              22,
              N_('Port')
            ),
            set(
              'ansible_user',
              N_('Foreman will try to connect to hosts as this user by '\
                 'default when running Ansible playbooks. You can '\
                 'override this on hosts by adding a parameter '\
                 '"ansible_user"'),
              'root',
              N_('User')
            ),
            set(
              'ansible_become',
              N_('Foreman will use the sudo command to run roles on hosts '\
                 'You can override this on hosts by adding a parameter '\
                 '"ansible_become"'),
              'true',
              N_('Become')
            ),
            set(
              'ansible_ssh_pass',
              N_('Use this password by default when running Ansible '\
                 'playbooks. You can override this on hosts '\
                 'by adding a parameter "ansible_ssh_pass"'),
              'ansible',
              N_('Password')
            ),
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
              N_('Foreman will add the this level of verbosity for '\
                 'additional debugging output when running Ansible playbooks.'),
              '',
              N_('Default verbosity level'),
              nil,
              :collection => lambda do
                { '' => N_('Disabled'),
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
                 'Set this to the maximum time you expect a host to take until'\
                 ' it is ready after a reboot.'),
              '360',
              N_('Post-provision timeout')
            )
          ].compact.each do |s|
            create(s.update(:category => 'Setting::Ansible'))
          end
        end

        true
      end

      def humanized_category
        N_('Ansible')
      end
    end
  end
end
