module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_roles
      ForemanAnsible::RolesImporter.import!
      AnsibleRole.all
    end

    def available_ansible_roles(target)
      ansible_roles.where.not(:id => target.parent_ansible_roles.map(&:id))
    end
  end
end
