# frozen_string_literal: true

require 'resolv'
module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostManagedExtensions
    def self.prepended(base)
      base.instance_eval do
        include ::ForemanAnsible::Concerns::JobInvocationHelper

        has_many :host_ansible_roles, -> { order('host_ansible_roles.position ASC') }, :foreign_key => :host_id
        accepts_nested_attributes_for :host_ansible_roles, :allow_destroy => true
        has_many :ansible_roles,
                 -> { order('host_ansible_roles.position ASC') },
                 :through => :host_ansible_roles,
                 :dependent => :destroy
        scoped_search :relation => :ansible_roles, :on => :name,
                      :complete_value => true, :rename => :ansible_role,
                      :only_explicit => true, ext_method: :search_by_role

        before_provision :play_ansible_roles
        audit_associations :ansible_roles
      end

      base.singleton_class.prepend ClassMethods
    end

    def inherited_ansible_roles
      return [] unless hostgroup
      hostgroup.inherited_and_own_ansible_roles
    end

    def own_ansible_roles
      ansible_roles.where.not(:id => inherited_ansible_roles.pluck(:id))
    end

    def available_ansible_roles
      AnsibleRole.where.not(:id => all_ansible_roles.pluck(:id))
    end

    # This one should be fixed, disabled for the moment as we're
    # in a rush to get the release out
    def play_ansible_roles
      return true unless ansible_roles.present? ||
                         inherited_ansible_roles.present?
      composer = job_composer(:ansible_run_host, self)
      composer.triggering.mode = :future
      composer.triggering.start_at = (
        Time.zone.now +
        Setting[:ansible_post_provision_timeout].to_i.seconds
      )
      composer.trigger!
      logger.info("Task for Ansible roles on #{self} before_provision: "\
                  "#{job_invocation_path(composer.job_invocation)}")
    rescue Foreman::Exception => e
      logger.info("Error running Ansible roles on #{self} before_provision: "\
                  "#{e.message}")
    end

    def all_ansible_roles
      (inherited_ansible_roles + ansible_roles).uniq
    end

    # Class methods we may need to override or add
    module ClassMethods
      def import_host(*args)
        host = super(*args)
        hostname = args[0]
        if (Resolv::IPv4::Regex.match?(hostname) || Resolv::IPv6::Regex.match?(hostname)) &&
           (host_nic = Nic::Interface.find_by(:ip => hostname))
          host = host_nic.host
        end
        host
      end

      def search_by_role(_key, operator, value)
        conditions = sanitize_sql_for_conditions(["ansible_roles.name #{operator} ?", value_to_sql(operator, value)])
        host_ids = ::Host::Managed.joins(:ansible_roles).where(conditions).distinct.pluck(:id)
        hostgroup_ids = ::Hostgroup.unscoped.with_taxonomy_scope.joins(:ansible_roles).where(conditions).map(&:subtree_ids).flatten

        conds = []
        conds << "hosts.id IN(#{host_ids.join(',')})" if host_ids.present?
        conds << "hosts.hostgroup_id IN(#{hostgroup_ids.uniq.join(',')})" if hostgroup_ids.present?
        { conditions: conds.join(' OR ').presence || '1 = 0' }
      end
    end
  end
end

module Host
  class Managed
    apipie :class do
      property :all_ansible_roles, array_of: 'AnsibleRole', desc: 'Returns all ansible roles assigned to the host, both its own and inherited from the host group and its parents'
      property :ansible_roles, array_of: 'AnsibleRole', desc: 'Returns ansible roles directly assigned to the host'
      property :inherited_ansible_roles, array_of: 'AnsibleRole', desc: 'Returns only ansible roles assigned to the host\'s host group and its parents'
    end
    # Methods to be allowed in any template with safemode enabled
    class Jail < Safemode::Jail
      allow :all_ansible_roles, :ansible_roles, :inherited_ansible_roles
    end
  end
end
