module ForemanAnsible
  class AnsibleInfo < ::HostInfo::Provider
    def host_info(redact_secrets = false)
      { 'parameters' => ansible_params(redact_secrets) }
    end

    def ansible_params(redact_secrets = false)
      variables = AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles.pluck(:id), :override => true)
      values = variables.values_hash(host)

      variables.each_with_object({}) do |var, memo|
        value = values[var]
        unless value.nil?
          memo[var.key] = redact_secrets && var.hidden_value? ? var.hidden_value : value
        end
        memo
      end
    end
  end
end
