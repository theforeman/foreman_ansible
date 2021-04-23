module ForemanAnsible
  # Service which resolves override values for hosts
  class OverrideResolver
    attr_reader :overrides, :ansible_variables

    def initialize(host)
      @overrides = {}
      return unless host
      @ansible_variables = AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles, :override => true)
      @overrides = @ansible_variables.values_hash(host).raw
    end

    def resolve(ansible_variable)
      override = @overrides[ansible_variable.id]
      return unless override
      override[ansible_variable.key]
    end
  end
end
