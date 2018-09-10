# frozen_string_literal: true

module ForemanAnsible
  # Methods to transform variable names coming from the proxy into
  # Foreman AnsibleVariable objects
  class VariablesImporter
    include ::ForemanAnsible::ProxyAPI

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    def import_variable_names(new_roles)
      return import_variables(remote_variables, new_roles) if @ansible_proxy
      import_variables(local_variables, new_roles)
    end

    def import_variables(role_variables, new_roles)
      detect_changes(
        role_variables.map do |role_name, variables|
          role = import_new_role(role_name, new_roles)
          next if role.blank?
          initialize_variables(variables, role)
        end.select(&:present?).flatten.compact
      )
    end

    def import_new_role(role_name, new_roles)
      role = AnsibleRole.find_by(:name => role_name)
      if role.blank? && new_roles.map(&:name).include?(role_name)
        role = new_roles.select { |r| r.name == role_name }.first
      end
      role
    end

    def initialize_variables(variables, role)
      variables.map do |variable|
        variable = AnsibleVariable.find_or_initialize_by(
          :key => variable
          # :key_type, :default_value, :required
        )
        variable.ansible_role = role
        variable.valid? ? variable : nil
      end
    end

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      old, changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = AnsibleVariable.where.not(:id => old.map(&:id))
      changes
    end

    def finish_import(new, obsolete)
      results = { :added => [], :obsolete => [] }
      results[:added] = create_new_variables(new) if new.present?
      results[:obsolete] = delete_old_variables(obsolete) if obsolete.present?
      results
    end

    def create_new_variables(new)
      added = []
      new.each do |role, variables|
        variables.each_value do |variable_properties|
          variable = AnsibleVariable.new(
            JSON.parse(variable_properties)['ansible_variable']
          )
          variable.ansible_role = ::AnsibleRole.find_by(:name => role)
          variable.save
          added << variable.key
        end
      end
      added
    end

    def delete_old_variables(old)
      removed = []
      old.each_value do |variable_properties|
        variable = AnsibleVariable.find(
          JSON.parse(variable_properties)['ansible_variable']['id']
        )
        removed << variable.key
        variable.destroy
      end
      removed
    end

    private

    def local_variables
      ::AnsibleVariable.all
    end

    def remote_variables
      proxy_api.all_variables
    end
  end
end
