module ForemanAnsible
  # Service to import roles from the filesystem.
  # Should be extracted to a gem that both the proxy and Foreman can use.
  class RolesImporter
    class << self
      def import!
        list_roles_in_fs.each do |role_name|
          role = AnsibleRole.new(:name => role_name)
          next if role.save
          Rails.logger.debug("Failed to save role #{role_name}: "\
                            "#{role.errors.full_messages.join(', ')}")
        end
      end

      private

      def list_roles_in_fs
        Dir.glob('/etc/ansible/roles/*').map do |path|
          path.split('/').last
        end
      end
    end
  end
end
