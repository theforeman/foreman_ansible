# frozen_string_literal: true

module ForemanAnsible
  # imports ansible roles through UI
  class UiRolesImporter < RolesImporter
    def import!
      import_role_names
    end

    def finish_import(changes)
      return if changes.blank?
      create_new_roles changes['new'] if changes['new']
      delete_old_roles changes['obsolete'] if changes['obsolete']
    end

    def create_new_roles(changes)
      changes.each_value do |new_role|
        ::AnsibleRole.create(JSON.parse(new_role))
      end
    end

    def delete_old_roles(changes)
      changes.each_value do |old_role|
        ::AnsibleRole.find(JSON.parse(old_role)['id']).destroy
      end
    end
  end
end
