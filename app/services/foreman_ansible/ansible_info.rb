module ForemanAnsible
  class AnsibleInfo < ::HostInfo::Provider
    def host_info
      { 'parameters' => ansible_params }
    end

    def ansible_params
      variables = AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles.pluck(:id))
      values = variables.values_hash(host)

      variables.each_with_object({}) do |var, memo|
        value = values[var]
        memo[var.key] = value if value
        memo
      end
    end
  end
end
