module ForemanAnsible
  # Service which resolves override values for hosts
  class OverrideResolver
    attr_reader :overrides, :ansible_variables

    def initialize(host, variable_ids = [])
      raise(Foreman::Exception.new('OverrideResolver needs a host to resolve overrides')) unless host
      @ansible_variables = if variable_ids.empty?
                             AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles, :override => true)
                           else
                             AnsibleVariable.where(:id => variable_ids, :override => true)
                           end
      @overrides = @ansible_variables.values_hash(host).raw
    end

    def resolve(ansible_variable)
      override = @overrides[ansible_variable.id]
      return unless override
      override[ansible_variable.key]
    end
  end
end
