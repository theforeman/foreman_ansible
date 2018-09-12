# frozen_string_literal: true

module ForemanAnsible
  # imports Ansible roles through API
  class ApiRolesImporter < RolesImporter
    def import!
      new_roles = import_role_names[:new]
      new_roles.map(&:save)
      new_roles
    end

    def obsolete!
      obsolete_roles = import_role_names[:obsolete]
      obsolete_roles.map(&:destroy)
      obsolete_roles
    end
  end
end
