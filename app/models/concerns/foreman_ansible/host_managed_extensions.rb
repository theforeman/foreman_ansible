# frozen_string_literal: true

require 'ipaddress'
module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostManagedExtensions
    # rubocop:disable Metrics/BlockLength
    def self.prepended(base)
      base.instance_eval do
        include ::ForemanAnsible::Concerns::JobInvocationHelper

        has_many :host_ansible_roles, :foreign_key => :host_id
        has_many :ansible_roles, :through => :host_ansible_roles,
                                 :dependent => :destroy
        scoped_search :relation => :ansible_roles, :on => :name,
                      :complete_value => true, :rename => :ansible_role,
                      :only_explicit => true

        before_provision :play_ansible_roles
        audit_associations :ansible_roles
      end

      base.singleton_class.prepend ClassMethods
    end

    def inherited_ansible_roles
      return [] unless hostgroup
      hostgroup.inherited_and_own_ansible_roles
    end

    # This one should be fixed, disabled for the moment as we're
    # in a rush to get the release out
    # rubocop:disable Metrics/AbcSize
    def play_ansible_roles
      return true unless ansible_roles.present? ||
                         inherited_ansible_roles.present?
      composer = job_composer(:ansible_run_host, self)
      composer.triggering.mode = :future
      composer.triggering.start_at = (
        Time.zone.now +
        Setting::Ansible[:ansible_post_provision_timeout].to_i.seconds
      )
      composer.trigger!
      logger.info("Task for Ansible roles on #{self} before_provision: "\
                  "#{job_invocation_path(composer.job_invocation)}")
    rescue Foreman::Exception => e
      logger.info("Error running Ansible roles on #{self} before_provision: "\
                  "#{e.message}")
    end
    # rubocop:enable Metrics/AbcSize

    def all_ansible_roles
      (ansible_roles + inherited_ansible_roles).uniq
    end

    def host_params_hash
      values = AnsibleVariable.where(:ansible_role_id => all_ansible_roles.pluck(:id)).
               values_hash(self).raw.values
      transformed = values.each_with_object({}) do |item, memo|
        item.map do |name, hash|
          variable = AnsibleVariable.find_by :key => name
          safe_value = variable.hidden_value? ? variable.safe_value : hash[:value]
          memo[name] = { :value => hash[:value], :safe_value => safe_value, :source => 'global' }
        end
        memo
      end

      super.merge transformed
    end

    # rubocop:enable Metrics/BlockLength
    # Class methods we may need to override or add
    module ClassMethods
      def import_host(*args)
        host = super(*args)
        hostname = args[0]
        if IPAddress.valid?(hostname) &&
           (host_nic = Nic::Interface.find_by(:ip => hostname))
          host = host_nic.host
        end
        host
      end
    end
  end
end

module Host
  class Managed
    # Methods to be allowed in any template with safemode enabled
    class Jail < Safemode::Jail
      allow :all_ansible_roles, :ansible_roles, :inherited_ansible_roles
    end
  end
end
