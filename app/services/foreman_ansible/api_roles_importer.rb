# frozen_string_literal: true

module ForemanAnsible
  # imports Ansible roles through API
  class ApiRolesImporter < RolesImporter
    def import!(role_names = nil)
      new_roles = import_role_names[:new]
      if role_names.present?
        new_roles.select! do |role|
          role_names.include?(role.name)
        end
      end
      new_roles.map(&:save)
      new_roles
    end

    def obsolete!
      obsolete_roles = import_role_names[:obsolete]
      obsolete_roles.map(&:destroy)
      obsolete_roles
    end

    def fetch!
      fetch_role_names
    end
  end
end
