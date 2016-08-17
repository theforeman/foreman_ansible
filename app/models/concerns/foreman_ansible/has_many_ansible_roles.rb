module ForemanAnsible
  # Define common behaviors between models that have many Ansible roles,
  # currently Host and Hostgroup. Takes care of inheritance, etc...
  module HasManyAnsibleRoles
    extend ActiveSupport::Concern

    included do
      def all_ansible_roles
        (ansible_roles + inherited_ansible_roles).uniq
      end
    end
  end
end
