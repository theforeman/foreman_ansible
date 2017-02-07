module ForemanAnsible
  class UpdateRoles
    attr_reader :proxy, :source

    def initialize(proxy_id)
      @proxy = ::SmartProxy.find proxy_id if proxy_id
    end

    def has_available_proxy?
      return true unless proxy
      return false unless proxy.has_feature? 'Ansible'
      return false unless proxy_reachable?
      true
    end

    def run
      roles_importer = RolesImporter.new
      imported = source.roles
      imported.each do |role_name, folders|
        role = ::AnsibleRole.find_by :name => role_name
        next unless role
        roles_importer.process_files(role, folders)
        role.ansible_proxy = proxy
        role.save
      end
    end

    private

    def source
      @source ||= proxy ? ::ProxyAPI::Ansible.new(proxy.url) : ForemanAnsibleExporter::RolesExporter.new('/etc/ansible/roles')
    end

    def proxy_reachable?
      api = ::ProxyAPI::Features.new proxy.url
      api.features
    rescue ProxyException
      false
    end
  end
end
