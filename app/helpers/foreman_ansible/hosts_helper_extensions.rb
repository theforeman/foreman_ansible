module ForemanAnsible
  # Chained methods to extend the hosts menu with Ansible actions
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain(:host_title_actions, :run_ansible_roles)
      alias_method_chain(:multiple_actions, :run_ansible_roles)
    end

    def host_title_actions_with_run_ansible_roles(*args)
      button = link_to(
        icon_text('play', ' ' + _('Ansible roles'), :kind => 'fa'),
        play_roles_host_path(:id => args.first.id),
        :id => :ansible_roles_button,
        :class => 'btn btn-default'
      )
      title_actions(button_group(button)) if args.first.ansible_roles.present?
      host_title_actions_without_run_ansible_roles(*args)
    end

    def multiple_actions_with_run_ansible_roles
      multiple_actions_without_run_ansible_roles +
        [[_('Play Ansible roles'),
          multiple_play_roles_hosts_path,
          false]]
    end
  end
end
