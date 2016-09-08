module ForemanAnsible
  # Contains proxy selection rules for a host playbook run
  class ProxySelector < ::ForemanTasks::ProxySelector
    # rubocop:disable Metrics/MethodLength
    def available_proxies(host)
      proxies = {}

      proxies[:fallback] = host.smart_proxies.with_features('Ansible')
      proxy_scope = if Taxonomy.enabled_taxonomies.any?
                      ::SmartProxy.with_taxonomy_scope_override(host.location,
                                                                host.organization) # rubocop:disable Metrics/LineLength
                    else
                      ::SmartProxy
                    end

      proxy_scope = proxy_scope.authorized
      proxies[:global] = proxy_scope.with_features('Ansible')
      proxies
    end
  end
end
