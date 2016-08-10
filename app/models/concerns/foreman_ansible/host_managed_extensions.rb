module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostManagedExtensions
    extend ActiveSupport::Concern

    included do
      has_many :host_ansible_roles, :foreign_key => :host_id
      has_many :ansible_roles, :through => :host_ansible_roles,
                               :dependent => :destroy
    end

    def ansible_proxies(authorized = true)
      proxies = {}
      proxies[:fallback] = smart_proxies.with_features('Ansible')

      # TODO: Add a setting for this
      # if Setting[:remote_execution_global_proxy]
      proxy_scope = if Taxonomy.enabled_taxonomies.any?
                      ::SmartProxy.with_taxonomy_scope_override(location, organization)
                    else
                      proxy_scope = ::SmartProxy
                    end

      proxy_scope = proxy_scope.authorized if authorized
      proxies[:global] = proxy_scope.with_features('Ansible')
      # end

      proxies
    end
  end
end
