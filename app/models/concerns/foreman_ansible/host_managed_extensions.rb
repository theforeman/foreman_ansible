module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostManagedExtensions
    extend ActiveSupport::Concern

    included do
      has_many :host_ansible_roles, :foreign_key => :host_id
      has_many :ansible_roles, :through => :host_ansible_roles,
                               :dependent => :destroy
      include ForemanAnsible::HasManyAnsibleRoles

      def inherited_ansible_roles
        return [] unless hostgroup
        hostgroup.all_ansible_roles
      end
    end
  end
end
