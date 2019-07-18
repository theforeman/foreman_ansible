module ForemanAnsible
  class AnsibleInfo < ::HostInfo::Provider
    def host_info
      if Setting[:ansible_parameterized_roles_in_enc]
        { 'roles' => ansible_roles }
      else
        { 'parameters' => ansible_params }
      end
    end

    def ansible_params
      variables = AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles.pluck(:id), :override => true)
      values = variables.values_hash(host)

      variables.each_with_object({}) do |var, memo|
        value = values[var]
        memo[var.key] = value if value
        memo
      end
    end

    def ansible_roles
      roles = host.all_ansible_roles.pluck(:id, :name)

      roles.each_with_object({}) do |role, rmemo|
        variables = AnsibleVariable.where(:ansible_role_id => role[0], :override => true)
        values = variables.values_hash(host)

        rmemo[role[1]] = variables.each_with_object({}) do |var, memo|
          value = values[var]
          memo[var.key] = value if value
        end
      end
    end

  end
end
