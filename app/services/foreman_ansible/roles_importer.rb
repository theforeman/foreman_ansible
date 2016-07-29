module ForemanAnsible
  # imports roles from smart proxy
  class RolesImporter
    attr_reader :ansible_proxy

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    def import!
      return import_roles remote_roles if ansible_proxy
      import_roles local_roles
    end

    def import_roles(roles)
      imported = roles.map do |role_name|
        ::AnsibleRole.find_or_initialize_by(:name => role_name)
      end
      detect_changes imported
    end

    def finish_import(changes)
      return unless  changes.present?
      create_new_roles changes['new'] if changes['new']
      delete_old_roles changes['obsolete'] if changes['obsolete']
    end

    def create_new_roles(changes)
      changes.values.each do |new_role|
        ::AnsibleRole.create(JSON.parse(new_role))
      end
    end

    def delete_old_roles(changes)
      changes.values.each do |old_role|
        ::AnsibleRole.find(JSON.parse(old_role)['id']).destroy
      end
    end

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      old, changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = ::AnsibleRole.where.not(:id => old.map(&:id))
      changes
    end

    private

    def find_proxy_api
      raise ::Foreman::Exception.new(N_('Proxy not found')) unless ansible_proxy
      @proxy_api = ::ProxyAPI::Ansible.new(:url => ansible_proxy.url)
    end

    def proxy_api
      return @proxy_api if @proxy_api
      find_proxy_api
    end

    def local_roles
      Dir.glob('/etc/ansible/roles/*').map do |path|
        path.split('/').last
      end
    end

    def remote_roles
      proxy_api.roles
    end
  end
end
