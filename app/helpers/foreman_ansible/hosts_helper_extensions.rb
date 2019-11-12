# frozen_string_literal: true

module ForemanAnsible
  # Chained methods to extend the hosts menu with Ansible actions
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    module Overrides
      def multiple_actions
        actions = super
        if User.current.can?(:create_job_invocations) &&
           User.current.can?(:play_roles_on_host)
          actions += [[_('Run all Ansible roles'),
                       multiple_play_roles_hosts_path,
                       false]]
        end
        actions
      end
    end

    included do
      prepend Overrides
    end

    def ansible_roles_present?(host)
      host.ansible_roles.present? ||
        host.inherited_ansible_roles.present?
    end
  end
end
