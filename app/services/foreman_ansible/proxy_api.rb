# frozen_string_literal: true

module ForemanAnsible
  # Helper methods to create a ProxyAPI object for Ansible
  module ProxyAPI
    extend ActiveSupport::Concern

    included do
      attr_reader :ansible_proxy

      def find_proxy_api(ansible_proxy)
        if ansible_proxy.blank?
          raise ::Foreman::Exception.new(N_('Proxy not found'))
        end
        ::ProxyAPI::Ansible.new(:url => ansible_proxy.url)
      end

      def proxy_api
        @proxy_api ||= find_proxy_api(ansible_proxy)
      end
    end
  end
end
