module ForemanAnsibleCore
  # Implements the logic needed to read the roles and associated information
  class RolesReader
    class << self
      DEFAULT_CONFIG_FILE = '/etc/ansible/ansible.cfg'.freeze
      DEFAULT_ROLES_PATH = '/etc/ansible/roles'.freeze

      def list_roles
        roles_path.split(':').map { |path| read_roles(path) }.flatten
      end

      def roles_path(roles_line = roles_path_from_config)
        # Default to /etc/ansible/roles if none found
        return DEFAULT_ROLES_PATH if roles_line.empty?
        roles_path_key = roles_line.first.split('=').first.strip
        # In case of commented roles_path key "#roles_path", return default
        return DEFAULT_ROLES_PATH unless roles_path_key == 'roles_path'
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

      private

      def read_roles(roles_path)
        rescue_and_raise_file_exception ReadRolesException,
                                        roles_path, 'roles' do
          Dir.glob("#{roles_path}/*").map do |path|
            path.split('/').last
          end
        end
      end

      def roles_path_from_config
        rescue_and_raise_file_exception ReadConfigFileException,
                                        DEFAULT_CONFIG_FILE, 'config file' do
          File.readlines(DEFAULT_CONFIG_FILE).select do |line|
            line =~ /roles_path/
          end
        end
      end

      def rescue_and_raise_file_exception(exception, path, type)
        yield
      rescue Errno::ENOENT, Errno::EACCES => e
        logger.debug(e.backtrace)
        exception_message = "Could not read Ansible #{type} "\
                            "#{path} - #{e.message}"
        raise exception.new(exception_message)
      end
    end
  end
end
