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

    def ad_hoc_role_button
      [link_to_function(
        icon_text('play', ' ' + _('Ad hoc Ansible role'), :kind => 'fa'),
        'show_ad_hoc_role_modal()',
        :id => :ansible_ad_hoc_role_button,
        :class => 'btn btn-default'
      )]
    end

    def ansible_roles_button(host)
      if ansible_roles_present?(host)
        [link_to(
          icon_text('play', ' ' + _('Ansible roles'), :kind => 'fa'),
          play_roles_host_path(:id => host.id),
          :id => :ansible_roles_button, :class => 'btn btn-default',
          :'data-no-turbolink' => true
        )]
      else
        []
      end
    end

    def host_title_actions_with_run_ansible_roles(*args)
      buttons = ad_hoc_role_button
      buttons += ansible_roles_button(args.first)

      title_actions(button_group(buttons))

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
