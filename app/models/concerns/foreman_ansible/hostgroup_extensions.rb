module ForemanAnsible
  # Relations to make Hostgroup 'have' ansible roles
  module HostgroupExtensions
    extend ActiveSupport::Concern

    included do
      has_many :hostgroup_ansible_roles, :foreign_key => :hostgroup_id
      has_many :ansible_roles, :through => :hostgroup_ansible_roles,
                               :dependent => :destroy
      include ForemanAnsible::HasManyAnsibleRoles

      def inherited_ansible_roles
        ancestors.reduce([]) do |roles, hostgroup|
          roles + hostgroup.ansible_roles
        end.uniq
      end
    end
  end
end
