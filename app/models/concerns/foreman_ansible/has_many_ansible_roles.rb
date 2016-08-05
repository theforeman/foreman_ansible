module ForemanAnsible
  module HasManyAnsibleRoles
    extend ActiveSupport::Concern

    included do
      def all_ansible_roles
        (ansible_roles + inherited_ansible_roles).uniq
      end
    end
  end
end
