module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostManagedExtensions
    extend ActiveSupport::Concern

    included do
      has_many :host_ansible_roles, :foreign_key => :host_id
      has_many :ansible_roles, :through => :host_ansible_roles,
                               :dependent => :destroy
      scoped_search :relation => :ansible_roles, :on => :name,
                    :complete_value => true, :rename => :role,
                    :only_explicit => true

      before_provision :play_ansible_roles
      include ForemanAnsible::HasManyAnsibleRoles
      audit_associations :ansible_roles

      def inherited_ansible_roles
        return [] unless hostgroup
        hostgroup.all_ansible_roles
      end

      def play_ansible_roles
        return unless ansible_roles.present? || inherited_ansible_roles.present?
        task = ::ForemanTasks.async_task(
          ::Actions::ForemanAnsible::PlayHostRoles,
          self,
          ::ForemanAnsible::ProxySelector.new,
          :timeout => Setting['ansible_post_provision_timeout']
        )
        logger.info("Task for Ansible roles on #{self} before_provision: "\
                    "#{Rails.application.routes.url_helpers.task_path(task)}.")
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
