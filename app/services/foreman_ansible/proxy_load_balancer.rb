module ForemanAnsible
  class ProxyLoadBalancer

    attr_reader :offline

    def initialize
      @tasks   = {}
      @offline = []
    end

    # Get the least loaded proxy from the given list of proxies
    # TODO: Take host counts into consideration
    def next(proxies)
      exclude = @tasks.keys + @offline
      @tasks.merge!(get_counts(proxies - exclude))
      next_proxy = @tasks.select { |proxy, _| proxies.include?(proxy) }.min_by { |_, job_count| job_count }.try(:first)
      @tasks[next_proxy] += 1 if next_proxy.present?
      next_proxy
    end

    private

    def get_counts(proxies)
      proxies.inject({}) do |result, proxy|
        begin
          proxy_api = ProxyAPI::ForemanDynflow::DynflowProxy.new(:url => proxy.url)
          result[proxy] = proxy_api.tasks_count('running')
        rescue => e
          @offline << proxy
          Foreman::Logging.exception "Could not fetch task counts from #{proxy}, skipped.", e
        end
        result
      end
    end
  end
end
