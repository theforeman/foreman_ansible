module ForemanAnsible
  # imports Ansible roles through API
  class ApiRolesImporter < RolesImporter
    def import!
      new_roles = import_roles[:new]
      new_roles.map(&:save)
      new_roles
    end

    def obsolete!
      obsolete_roles = import_roles[:obsolete]
      obsolete_roles.map(&:destroy)
      obsolete_roles
    end
  end
end
