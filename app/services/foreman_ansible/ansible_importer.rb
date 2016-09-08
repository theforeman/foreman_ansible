module ForemanAnsible
  # Base importer class
  class AnsibleImporter
    attr_reader :ansible_proxy, :source

    def initialize(proxy = nil)
      @ansible_proxy = proxy
      @source = proxy.present? ? proxy_api : ForemanAnsibleExporter::FilesExporter.new('/etc/ansible/roles')
    end

    def proxy_api
      raise ::Foreman::Exception.new(N_("Proxy must have Ansible feature")) unless ansible_proxy.has_feature? 'Ansible'
      ::ProxyAPI::Ansible.new(:url => ansible_proxy.url)
    end
  end
end
