module ForemanAnsible
  class VcsCloner
    include ::ForemanAnsible::ProxyAPI

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    delegate :install_role, to: :proxy_api

    delegate :update_role, to: :proxy_api

    delegate :delete_role, to: :proxy_api
  end
end
