module ForemanAnsible
  module SmartProxiesHelper
    def can_update_proxy?(proxy)
      hosts = proxy.smart_proxy_hosts

      return if !can_schedule_jobs? ||
                hosts.empty? ||
                !hosts.all? { |host| can_execute_on_host?(host) }

      begin
        version = proxy.statuses[:version].version
      rescue Foreman::Exception
        return false
      end

      foreman_version = Foreman::Version.new
      proxy_version = Foreman::Version.new(version['version'])

      foreman_major = foreman_version.major.to_i
      foreman_minor = foreman_version.minor.to_i

      proxy_major = proxy_version.major.to_i
      proxy_minor = proxy_version.minor.to_i

      foreman_major > proxy_major ||
        (foreman_major == proxy_major && foreman_minor > proxy_minor)
    end

    def proxy_update_button(proxy)
      feature = RemoteExecutionFeature.feature(:ansible_run_capsule_upgrade)
      return if feature.nil?

      path = new_job_invocation_path(:host_ids => proxy.infrastructure_host_facets.pluck(:host_id),
                                     :feature => feature.label)
      link_to(_('Upgrade'), path)
    end
  end
end
