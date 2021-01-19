# frozen_string_literal: true

module ForemanAnsible
  # Imports roles from smart proxy
  class RolesImporter
    include ::ForemanAnsible::ProxyAPI

    def initialize(proxy = nil)
      @ansible_proxy = proxy
      @variables_importer = ForemanAnsible::VariablesImporter.new(@ansible_proxy)
    end

    def import_role_names
      import_roles remote_roles if @ansible_proxy.present?
    end

    def fetch_role_names
      remote_roles if ansible_proxy
    end

    def import_roles(roles)
      imported = roles.map do |role_name|
        ::AnsibleRole.find_or_initialize_by(:name => role_name)
      end
      detect_changes imported
    end

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      changes[:old], changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = ::AnsibleRole.where.not(:id => changes[:old].map(&:id))
      changes
    end

    private

    def remote_roles
      proxy_api.roles
    end
  end
end
