module Actions
  module Ansible
    class RunPlaybook < ::Dynflow::Action

      def plan(hosts, proxy)
        inventory = hosts.reduce({}) do |acc, cur|
          acc.merge(cur.fqdn => cur.ansible_roles.map(&:name))
        end

        # TODO: Determine proxy
        # if proxy.blank?
        #   offline_proxies = options.fetch(:offline_proxies, [])
        #   settings = { :count => offline_proxies.count, :proxy_names => offline_proxies.map(&:name).join(', ') }
        #   raise n_('The only applicable proxy %{proxy_names} is down',
        #            'All %{count} applicable proxies are down. Tried %{proxy_names}',
        #            offline_proxies.count) % settings unless offline_proxies.empty?

        #   settings = { :global_proxy   => 'remote_execution_global_proxy',
        #                :fallback_proxy => 'remote_execution_fallback_proxy' }

        #   raise _('Could not use any proxy. Consider configuring %{global_proxy} ' +
        #             'or %{fallback_proxy} in settings') % settings
        # end

        proxy = SmartProxy.all.first
        plan_action RunProxyAction, proxy,
                    :proxy_action_name => '::Proxy::Ansible::Command::Playbook::Action',
                    :inventory => inventory
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Fail
      end

      def humanized_input
        _("Run Ansible roles")
      end

      private

      def determine_proxy(template_invocation, host, load_balancer)
        provider = template_invocation.template.provider_type.to_s
        host_proxies = host.remote_execution_proxies(provider)
        strategies = [:subnet, :fallback, :global]
        proxy = nil

        strategies.each do |strategy|
          proxy = load_balancer.next(host_proxies[strategy]) if host_proxies[strategy].present?
          break if proxy
        end

        proxy
      end
    end
  end
end
