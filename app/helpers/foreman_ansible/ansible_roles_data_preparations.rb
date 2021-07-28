# frozen_string_literal: true

module ForemanAnsible
  module AnsibleRolesDataPreparations
    VARIABLE_ACTION_NAMES = { 'new' => _('Add'), 'obsolete' => _('Remove'), 'update' => _('Update') }.freeze
    ROLE_ACTION_NAMES = { 'new' => _('Import Role'), 'obsolete' => _('Remove Role'), 'old' => _('Update Role Variables') }.freeze

    def variable_action_name(kind)
      VARIABLE_ACTION_NAMES[kind]
    end

    def role_action_name(kind)
      ROLE_ACTION_NAMES[kind]
    end

    def get_old_roles_variables(imported_variables, role)
      variables = { 'new' => [], 'obsolete' => [], 'update' => [] }
      imported_variables.each do |kind, temp_variables|
        temp_variables.each do |temp_variable|
          variables[kind].append(temp_variable.key) if temp_variable.ansible_role_id == role.id
        end
      end
      variables
    end

    def variables_to_s(variables)
      str = ''
      variables.each do |action, temp_variables|
        str += "#{variable_action_name action}: #{temp_variables.size}, " unless temp_variables.empty?
      end
      str[0..-3]
    end

    def get_roles_variables(imported_variables, variables_importer, kind, role)
      if kind == 'new'
        variables = { 'new' => variables_importer.get_variables_names(role.name) }
      elsif kind == 'obsolete'
        variables = { 'obsolete' => role.ansible_variables.map(&:key) }
      elsif kind == 'old'
        variables = get_old_roles_variables(imported_variables, role)
      end
      variables_to_s(variables)
    end

    def excluded_roles
      Setting.convert_array_to_regexp(Setting[:ansible_roles_to_ignore])
    end

    def role_match_excluded_roles(role_name)
      match = role_name.match(excluded_roles)
      match.to_s.empty? ? nil : match
    end

    def prepare_api_row(role, kind, variables)
      {
        name: role.name,
        id: role.id,
        role_action: role_action_name(kind),
        variables: variables,
        hosts_count: kind == 'obsolete' ? role.hosts.count : '',
        hostgroup_count: kind == 'obsolete' ? role.hostgroups.count : '',
        kind: kind
      }
    end

    def prepare_ui_row(role, kind, variables)
      { cells: [
        role.name,
        role_action_name(kind),
        variables,
        kind == 'obsolete' ? role.hosts.count : '',
        kind == 'obsolete' ? role.hostgroups.count : ''
      ],
        role: role, kind: kind, id: role.name }
    end

    def prepare_ansible_import_rows(changed, variables_importer, is_ui = true)
      rows = []
      changed.each do |kind, roles|
        imported_variables = variables_importer.import_variable_names(roles)
        roles.each do |role|
          next if role_match_excluded_roles(role.name)
          variables = get_roles_variables(imported_variables, variables_importer, kind, role)
          next if variables.empty? && kind['old']
          if is_ui
            rows.append(prepare_ui_row(role, kind, variables))
          else
            rows.append(prepare_api_row(role, kind, variables))
          end
        end
      end
      rows
    end
  end
end
