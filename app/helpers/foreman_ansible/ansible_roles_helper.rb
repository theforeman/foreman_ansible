module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_roles
      ForemanAnsible::RolesImporter.import!
      AnsibleRole.all
    end
  end
end
