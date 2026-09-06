module ForemanAnsible
  class AnsibleInfo < ::HostInfo::Provider
    HIDDEN_VALUE = '*****'.freeze

    def host_info
      { 'parameters' => ansible_params }
    end

    def ansible_params
      variables = AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles.pluck(:id), :override => true)
      values = variables.values_hash(host)

      variables.each_with_object({}) do |var, memo|
        value = values[var]
        next memo if value.nil?
        memo[var.key] = var.hidden_value? ? HIDDEN_VALUE : value
        memo
      end
    end
  end
end
