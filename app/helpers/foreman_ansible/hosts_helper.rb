# frozen_string_literal: true

module ForemanAnsible
  module HostsHelper
    def ansible_hosts_multiple_actions
      return [] unless User.current.can?(:create_job_invocations) &&
                       User.current.can?(:play_roles_on_host)

      [{ action: [_('Run all Ansible roles'),
                  multiple_play_roles_hosts_path,
                  false], priority: 1000 }]
    end

    def ansible_roles_present?(host)
      host.ansible_roles.present? ||
        host.inherited_ansible_roles.present?
    end
  end
end
