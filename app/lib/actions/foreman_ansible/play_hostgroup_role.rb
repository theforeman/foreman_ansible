module Actions
  module ForemanAnsible
    # Action that initiates the playbook run for an Ansible role of a
    # hostgroup. It does that either locally or via a proxy when available.
    class PlayHostgroupRole < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction
      include Helpers::PlayRolesDescription
      include Helpers::HostCommon

      def plan(hostgroup, ansible_role, proxy_selector = ::ForemanAnsible::
               ProxySelector.new, options = {})
        proxy = find_hostgroup_and_proxy(hostgroup, proxy_selector)
        inventory_creator = ::ForemanAnsible::
          InventoryCreator.new(hostgroup.hosts)
        playbook_creator = ::ForemanAnsible::
          PlaybookCreator.new([ansible_role.name])
        plan_delegated_action(proxy, ::ForemanAnsibleCore::Actions::RunPlaybook,
                              :inventory => inventory_creator.to_hash.to_json,
                              :playbook => playbook_creator.roles_playbook,
                              :options => find_options.merge(options))
        plan_self
      end

      def humanized_input
        _('on host group %{name} through proxy %{proxy}') % {
          :name => input.fetch(:hostgroup, {})[:name],
          :proxy => running_proxy_name
        }
      end

      def humanized_name
        _('Play ad hoc Ansible role')
      end
    end
  end
end
