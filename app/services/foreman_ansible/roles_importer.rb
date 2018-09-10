# frozen_string_literal: true

module ForemanAnsible
  # Imports roles from smart proxy
  class RolesImporter
    include ::ForemanAnsible::ProxyAPI

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    def import_role_names
      return import_roles remote_roles if @ansible_proxy.present?
      import_roles local_roles
    end

    def import_roles(roles)
      imported = roles.map do |role_name|
        ::AnsibleRole.find_or_initialize_by(:name => role_name)
      end
      detect_changes imported
    end

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      old, changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = ::AnsibleRole.where.not(:id => old.map(&:id))
      changes
    end

    private

    def local_roles
      ::ForemanAnsibleCore::RolesReader.list_roles
    end

    def remote_roles
      proxy_api.roles
    end
  end
end
