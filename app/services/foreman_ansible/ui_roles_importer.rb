# frozen_string_literal: true

module ForemanAnsible
  # imports ansible roles through UI
  class UIRolesImporter < RolesImporter
    def import!
      import_role_names
    end

    def finish_import(changes)
      return if changes.blank?
      create_new_roles changes['new'] if changes['new']
      delete_old_roles changes['obsolete'] if changes['obsolete']
    end

    def create_new_roles(changes)
      changes.each_pair do |_, new_role|
        ::AnsibleRole.create(new_role)
      end
    end

    def delete_old_roles(changes)
      changes.each_pair do |_, old_role|
        ::AnsibleRole.find(old_role['id']).destroy
      end
    end
  end
end
