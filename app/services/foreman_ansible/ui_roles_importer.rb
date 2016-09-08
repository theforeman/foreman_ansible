module ForemanAnsible
  # imports ansible roles through UI
  class UiRolesImporter < RolesImporter
    def import!
      import_roles
    end

    def finish_import(changes)
      return unless changes.present?
      create_new_roles changes['new'] if changes['new']
      delete_old_roles changes['obsolete'] if changes['obsolete']
    end

    def create_new_roles(changes)
      changes.values.each do |new_role|
        role_hash = JSON.parse new_role
        new_files = create_new_files role_hash.delete('ansible_files')
        role = AnsibleRole.new(role_hash)
        role.ansible_files = new_files
        role.save
      end
    end

    def create_new_files(files_attrs)
      files_attrs.map { |attrs| AnsibleFile.create attrs }
    end

    def delete_old_roles(changes)
      changes.values.each do |old_role|
        ::AnsibleRole.find(JSON.parse(old_role)['id']).destroy
      end
    end
  end
end
