# frozen_string_literal: true

module ForemanAnsible
  module AnsibleHostgroupsHelper
    def ansible_hostgroups_actions(hostgroup)
      actions = []
      is_hostgroup_empty = hostgroup.all_ansible_roles.empty? || hostgroup.hosts_count.zero?

      if User.current.can?(:create_job_invocations)
        actions << {
          action: if is_hostgroup_empty
                    disabled_action_link(_('Run all Ansible roles'))
                  else
                    display_link_if_authorized(_('Run all Ansible roles'), hash_for_play_roles_hostgroup_path(id: hostgroup), 'data-no-turbolink': true, title: _('Run all Ansible roles on hosts belonging to this host group'))
                  end,
          priority: is_hostgroup_empty ? 131 : 31
        }
      end

      if User.current.can?(:view_job_invocations) && User.current.can?(:view_recurring_logics)
        actions << {
          action: if is_hostgroup_empty
                    disabled_action_link(_('Configure Ansible Job'))
                  else
                    link_to(_('Configure Ansible Job'), "/ansible/hostgroups/#{hostgroup.id}", class: 'la')
                  end,
          priority: is_hostgroup_empty ? 132 : 32
        }
      end

      actions
    end

    def disabled_action_link(text)
      {
        content: link_to(text, 'javascript:void(0);', disabled: true, title: _('No roles/hosts assigned'), class: 'disabled'),
        options: { class: 'disabled' }
      }
    end
  end
end
