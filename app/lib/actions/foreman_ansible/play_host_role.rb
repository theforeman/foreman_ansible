module Actions
  module ForemanAnsible
    # Action that initiates the playbook run for an Ansible role of a
    # host. It does that either locally or via a proxy when available.
    class PlayHostRole < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction
      include Helpers::PlayRolesDescription
      include Helpers::HostCommon

      def plan(host, ansible_role, proxy_selector = ::ForemanAnsible::
               ProxySelector.new, options = {})
        proxy = find_host_and_proxy(host, proxy_selector)
        inventory_creator = ::ForemanAnsible::InventoryCreator.new([host])
        playbook_creator = ::ForemanAnsible::
          PlaybookCreator.new([ansible_role.name])
        plan_delegated_action(proxy,
                              ::ForemanAnsibleCore::Actions::RunPlaybook,
                              :inventory => inventory_creator.to_hash.to_json,
                              :playbook => playbook_creator.roles_playbook,
                              :options => find_options.merge(options))
        plan_self
      end

      def humanized_input
        _('on host %{name} through %{proxy}') % {
          :name => input.fetch(:host, {})[:name],
          :proxy => running_proxy_name
        }
      end

      def humanized_name
        _('Play ad hoc Ansible role')
      end
    end
  end
end
