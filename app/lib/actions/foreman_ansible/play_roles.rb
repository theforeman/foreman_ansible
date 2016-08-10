module Actions
  module Ansible
    class PlayRoles < Actions::ActionWithSubPlans

      def plan(hosts)
        plan_self(:host_ids => hosts.map(&:id))
      end

      def create_sub_plans
        load_balancer = ::ForemanAnsible::ProxyLoadBalancer.new
        hosts = input[:host_ids].map { |id| Host.find(id) }

        grouped = hosts.reduce({}) do |acc, host|
          proxy = determine_proxy(host, load_balancer)
          acc.update(proxy => acc.fetch(proxy, []).push(host))
        end

        grouped.map do |proxy, hosts|
          trigger(RunProxyAction, proxy,
                  :inventory => inventory(hosts),
                  :proxy_action_name => '::Proxy::Ansible::Command::Playbook::Action')
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Fail
      end

      def humanized_input
        _("Play Ansible roles")
      end

      private

      def determine_proxy(host, load_balancer)
        host_proxies = host.ansible_proxies
        strategies = [:subnet, :fallback, :global]
        proxy = nil

        strategies.each do |strategy|
          proxy = load_balancer.next(host_proxies[strategy]) if host_proxies[strategy].present?
          break if proxy
        end

        proxy
      end

      def inventory(hosts)
        hosts.reduce({}) do |acc, cur|
          acc.merge(cur.fqdn => cur.ansible_roles.map(&:name))
        end
      end
    end
  end
end
