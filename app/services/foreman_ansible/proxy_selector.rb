module ForemanAnsible
  # Contains proxy selection rules for a host playbook run
  class ProxySelector < ::ForemanTasks::ProxySelector
    def available_proxies(host)
      proxies = {}
      proxies[:subnet] = host.execution_interface.subnet.remote_execution_proxies.with_features(provider) if execution_interface && execution_interface.subnet
      proxies[:fallback] = host.smart_proxies.with_features('Ansible')
      proxies[:global] = proxy_scope(host).authorized.with_features('Ansible')
      proxies
    end

    def determine_proxy(*args)
      result = super
      return result unless result == :not_available
      # Always run roles in some way, even if there are no proxies, Foreman
      # should take that role in that case.
      :not_defined
    end

    private

    def proxy_scope(host)
      return ::SmartProxy unless Taxonomy.enabled_taxonomies.any?
      ::SmartProxy.with_taxonomy_scope_override(host.location,
                                                host.organization)
    end
  end
end
