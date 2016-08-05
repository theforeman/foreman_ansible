module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostgroupExtensions
    extend ActiveSupport::Concern

    included do
      has_many :hostgroup_ansible_roles, :foreign_key => :hostgroup_id
      has_many :ansible_roles, :through => :hostgroup_ansible_roles,
                               :dependent => :destroy

      def all_ansible_roles
        (ansible_roles + parent_ansible_roles).uniq
      end

      def parent_ansible_roles
        ancestors.inject([]) { |roles, hostgroup| roles + hostgroup.ansible_roles }.uniq
      end
    end
  end
end
