# frozen_string_literal: true

module ForemanAnsible
  module AnsibleHostgroupsHelper
    def hostgroups_actions_array(hostgroup)
      play_roles = if hostgroup.all_ansible_roles.empty?
                     link_to _('Run all Ansible roles'), 'javascript:void(0);', disabled: true, title: 'No Roles assigned'
                   else
                     display_link_if_authorized(_('Run all Ansible roles'), hash_for_play_roles_hostgroup_path(id: hostgroup), 'data-no-turbolink': true, title: _('Run all Ansible roles on hosts belonging to this host group'))
                   end

      super.insert(super.length - 1, play_roles) if User.current.can?(:create_job_invocations)
    end
  end
end
