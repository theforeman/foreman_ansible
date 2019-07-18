module ForemanAnsible
  class AnsibleInfo < ::HostInfo::Provider
    def host_info
      { 'ansible_roles' => ansible_roles }
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

