module ForemanAnsibleCore
  # Implements the logic needed to read the roles and associated information
  class RolesReader
    class << self
      DEFAULT_CONFIG_FILE = '/etc/ansible/ansible.cfg'.freeze

      def list_roles
        logger.info('[foreman_ansible] - Reading roles from '\
                    '/etc/ansible/ansible.cfg roles_path')
        Dir.glob("#{roles_path}/*").map do |path|
          path.split('/').last
        end
      rescue Errno::ENOENT, Errno::EACCES => e
        logger.debug("[foreman_ansible] - #{e.backtrace}")
        exception_message = '[foreman_ansible] - Could not read Ansible config'\
          " file #{DEFAULT_CONFIG_FILE} - #{e.message}"
        raise ReadConfigFileException.new(exception_message)
      end

      def roles_path(ansible_config_file = DEFAULT_CONFIG_FILE)
        default_path = '/etc/ansible/roles'
        roles_line = File.readlines(ansible_config_file).select do |line|
          line =~ /roles_path/
        end
        # Default to /etc/ansible/roles if none found
        return default_path if roles_line.empty?
        roles_path_key = roles_line.first.split('=').first.strip
        # In case of commented roles_path key "#roles_path", return default
        return default_path unless roles_path_key == 'roles_path'
        # In case roles_path is there, and is not commented, return the value
        roles_line.first.split('=').last.strip
      end

      def logger
        # Return a different logger depending on where ForemanAnsibleCore is
        # running from
        if defined?(::Foreman::Logging)
          ::Foreman::Logging.logger('foreman_ansible')
        else
          ::Proxy::LogBuffer::Decorator.instance
        end
      end
    end
  end
end
