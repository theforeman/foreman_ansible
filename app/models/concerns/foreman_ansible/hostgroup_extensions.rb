# frozen_string_literal: true

module ForemanAnsible
  # Relations to make Hostgroup 'have' ansible roles
  module HostgroupExtensions
    extend ActiveSupport::Concern

    included do
      has_many :hostgroup_ansible_roles, -> { order('hostgroup_ansible_roles.position ASC') }, :foreign_key => :hostgroup_id
      has_many :ansible_roles,
               -> { order('hostgroup_ansible_roles.position ASC') },
               :through => :hostgroup_ansible_roles,
               :dependent => :destroy
      scoped_search :relation => :ansible_roles, :on => :name,
                    :complete_value => true, :rename => :ansible_role,
                    :only_explicit => true, :operators => ['= ', '!= ', '~ ', '!~ '], :ext_method => :search_by_role
      accepts_nested_attributes_for :hostgroup_ansible_roles, :allow_destroy => true
      audit_associations :ansible_roles
      include_in_clone :ansible_roles

      def inherited_ansible_roles
        ancestors.reduce([]) do |roles, hostgroup|
          roles + hostgroup.ansible_roles
        end.uniq
      end

      def inherited_and_own_ansible_roles
        path.reduce([]) do |roles, hostgroup|
          roles + hostgroup.ansible_roles
        end.uniq
      end

      def host_ansible_roles
        hosts.includes(:host_ansible_roles).flat_map(&:ansible_roles)
      end

      # includes also roles of all assigned hosts, useful to determine if
      # at least one host in this hostgroup has some ansible role assigned
      # either directly or through hostgroup
      def all_ansible_roles
        (inherited_ansible_roles + ansible_roles + host_ansible_roles).uniq
      end
    end

    class_methods do
      def search_by_role(_key, operator, value)
        conditions = sanitize_sql_for_conditions(["ansible_roles.name #{operator} ?", value_to_sql(operator, value)])
        hostgroup_ids = ::Hostgroup.joins(:ansible_roles).where(conditions).map(&:subtree_ids).flatten

        conds = "hostgroups.id IN(#{hostgroup_ids.join(',')})" if hostgroup_ids.present?
        { conditions: conds.presence || '1 = 0' }
      end
    end
  end
end

class Hostgroup
  apipie :class do
    property :all_ansible_roles, array_of: 'AnsibleRole', desc: 'Returns all ansible roles assigned to the host group, both its own and inherited from parent host groups'
    property :ansible_roles, array_of: 'AnsibleRole', desc: 'Returns ansible roles directly assigned to the host group'
    property :inherited_ansible_roles, array_of: 'AnsibleRole', desc: 'Returns only the inherited ansible roles assigned to the host group\'s parents'
  end
  # Methods to be allowed in any template with safemode enabled
  class Jail < Safemode::Jail
    allow :all_ansible_roles, :ansible_roles, :inherited_ansible_roles
  end
end
