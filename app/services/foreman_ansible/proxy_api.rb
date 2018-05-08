module ForemanAnsible
  # Helper methods to create a ProxyAPI object for Ansible
  module ProxyAPI
    extend ActiveSupport::Concern

    included do
      attr_reader :ansible_proxy

      def find_proxy_api
        if ansible_proxy.blank?
          raise ::Foreman::Exception.new(N_('Proxy not found'))
        end
        @proxy_api = ::ProxyAPI::Ansible.new(:url => ansible_proxy.url)
      end

      def proxy_api
        return @proxy_api if @proxy_api
        find_proxy_api
      end
    end
  end
end
