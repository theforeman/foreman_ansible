# frozen_string_literal: true

module ForemanAnsible
  module AnsibleHostgroupsHelper
    def ansible_hostgroups_actions(hostgroup)
      actions = []
      play_roles = if hostgroup.all_ansible_roles.empty?
                     { action: { content: (link_to _('Run all Ansible roles'), 'javascript:void(0);', disabled: true, title: 'No roles assigned', class: 'disabled'), options: { class: 'disabled' } }, priority: 31 }
                   else
                     { action: display_link_if_authorized(_('Run all Ansible roles'), hash_for_play_roles_hostgroup_path(id: hostgroup), 'data-no-turbolink': true, title: _('Run all Ansible roles on hosts belonging to this host group')), priority: 31 }
                   end

      assign_jobs = { action: { content: (link_to _('Configure Ansible Job'), "/ansible/hostgroups/#{hostgroup.id}", class: 'la') }, priority: 32 }

      actions.push play_roles if User.current.can?(:create_job_invocations)
      actions.push assign_jobs if User.current.can?(:view_job_invocations) && User.current.can?(:view_recurring_logics)

      actions
    end
  end
end
