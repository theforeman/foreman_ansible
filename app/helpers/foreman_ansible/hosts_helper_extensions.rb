module ForemanAnsible
  # Chained methods to extend the hosts menu with Ansible actions
  module HostsHelperExtensions
    extend ActiveSupport::Concern

    module Overrides
      def host_title_actions(*args)
        host = args.first
        if ansible_roles_present?(host)
          button = ansible_roles_button(host)
          title_actions(button_group(button))
        end
        super(*args)
      end

      def multiple_actions
        super +
          [[_('Play Ansible roles'),
            multiple_play_roles_hosts_path,
            false]]
      end
    end

    included do
      prepend Overrides
    end

    def ansible_roles_present?(host)
      host.ansible_roles.present? ||
        host.inherited_ansible_roles.present?
    end

    def ansible_roles_button(host)
      link_to(
        _('Run Ansible roles'),
        play_roles_host_path(:id => host.id),
        :id => :ansible_roles_button,
        :class => 'btn btn-default',
        :'data-no-turbolink' => true
      )
    end
  end
end
