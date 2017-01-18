module ForemanAnsible
  # Chained methods to extend the hosts menu with Ansible actions
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    included do
      alias_method_chain(:host_title_actions, :run_ansible_roles)
      alias_method_chain(:multiple_actions, :run_ansible_roles)
    end

    def ansible_roles_present?(host)
      host.ansible_roles.present? ||
        host.inherited_ansible_roles.present?
    end

    def ansible_roles_button(host)
      link_to(
        icon_text('play', ' ' + _('Ansible roles'), :kind => 'fa'),
        play_roles_host_path(:id => host.id),
        :id => :ansible_roles_button,
        :class => 'btn btn-default',
        :'data-no-turbolink' => true
      )
    end

    def host_title_actions_with_run_ansible_roles(*args)
      host = args.first
      if ansible_roles_present?(host)
        button = ansible_roles_button(host)
        title_actions(button_group(button))
      end
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
