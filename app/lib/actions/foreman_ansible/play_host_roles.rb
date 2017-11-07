module Actions
  module ForemanAnsible
    # Action that initiates the playbook run for roles assigned to
    # the host. It does that either locally or via a proxy when available.
    class PlayHostRoles < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction
      include Helpers::PlayRolesDescription
      include Helpers::HostCommon

      def plan(host, proxy_selector = ::ForemanAnsible::ProxySelector.new,
               options = {})
        proxy = find_host_and_proxy(host, proxy_selector)
        role_names = host.all_ansible_roles.map(&:name)
        inventory_creator = ::ForemanAnsible::InventoryCreator.new([host])
        playbook_creator = ::ForemanAnsible::PlaybookCreator.new(role_names)
        plan_delegated_action(proxy,
                              ::ForemanAnsibleCore::Actions::RunPlaybook,
                              :inventory => inventory_creator.to_hash.to_json,
                              :playbook => playbook_creator.roles_playbook,
                              :options => find_options.merge(options))
        plan_self
      end

      def humanized_input
        format(_('on host %{name} through %{proxy}'),
               :name => input.fetch(:host, {})[:name],
               :proxy => running_proxy_name)
      end

      private

      def find_host_and_proxy(host, proxy_selector)
        proxy = proxy_selector.determine_proxy(host)
        input[:host] = { :id => host.id,
                         :name => host.fqdn,
                         :proxy_used => proxy.try(:name) || :not_defined }
        proxy
      end
    end
  end
end
