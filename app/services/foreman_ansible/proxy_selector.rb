module ForemanAnsible
  # Contains proxy selection rules for a host playbook run
  class ProxySelector < ::ForemanTasks::ProxySelector
    def available_proxies(host)
      proxies = {}
      proxies[:fallback] = host.smart_proxies.with_features('Ansible')
      proxies[:global] = proxy_scope(host).authorized.with_features('Ansible')
      proxies
    end

    private

    def proxy_scope(host)
      return ::SmartProxy unless Taxonomy.enabled_taxonomies.any?
      ::SmartProxy.with_taxonomy_scope_override(host.location,
                                                host.organization)
    end
  end
end
