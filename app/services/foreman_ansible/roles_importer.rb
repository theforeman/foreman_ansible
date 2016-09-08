module ForemanAnsible
  # imports roles from source
  class RolesImporter < AnsibleImporter

    def import_roles
      process_roles source.roles
    end

    def process_roles(roles_hash)
      imported = roles_hash.map do |role_name, folders|
        role = AnsibleRole.find_or_initialize_by(:name => role_name)
        role.ansible_files = process_files role, folders
        role.ansible_proxy = ansible_proxy
        role
      end
      detect_changes imported
    end

    def process_files(role, folders)
      folders.flat_map do |folder, files|
        files.flat_map do |file|
          AnsibleFile.find_or_initialize_by(:name => file, :dir => folder, :ansible_role_id => role.id)
        end
      end
    end

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      old, changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = ::AnsibleRole.where.not(:id => old.map(&:id))
      changes
    end
  end
end
