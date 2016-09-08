module Actions
  module ForemanAnsible
    # Bulk action for running ansible roles
    class PlayHostsRoles < Actions::ActionWithSubPlans
      def plan(hosts)
        plan_self(:host_ids => hosts.map(&:id))
      end

      def create_sub_plans
        proxy_selector = ::ForemanAnsible::ProxySelector.new
        input[:host_ids].map do |host_id|
          host = Host.find(host_id)
          trigger(PlayHostRoles, host, proxy_selector)
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Fail
      end

      def humanized_name
        _('Bulk play Ansible roles')
      end
    end
  end
end
