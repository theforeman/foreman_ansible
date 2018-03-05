module ForemanAnsible
  # Relations to make Hostgroup 'have' ansible roles
  module HostgroupExtensions
    extend ActiveSupport::Concern

    included do
      has_many :hostgroup_ansible_roles, :foreign_key => :hostgroup_id
      has_many :ansible_roles, :through => :hostgroup_ansible_roles,
                               :dependent => :destroy
      include ForemanAnsible::HasManyAnsibleRoles
      audit_associations :ansible_roles

      def inherited_ansible_roles
        ancestors.reduce([]) do |roles, hostgroup|
          roles + hostgroup.ansible_roles
        end.uniq
      end

      def host_ansible_roles
        hosts.all.includes(:ansible_roles).flat_map(&:ansible_roles)
      end
    end
  end
end
