module ForemanAnsible
  # Service which resolves override values for hosts and hostgroups
  class OverrideResolver
    attr_reader :overrides, :ansible_variables

    def initialize(host_or_hg)
      @overrides = calculate_variable_overrides(host_or_hg)
    end

    def resolve(ansible_variable)
      override = @overrides[ansible_variable.id]
      return unless override
      override[ansible_variable.key]
    end

    private

    def calculate_variable_overrides(resource)
      if resource.is_a? Hostgroup
        @ansible_variables = AnsibleVariable.where(:ansible_role_id => resource.inherited_and_own_ansible_roles, :override => true)
        hostgroup_values_hash resource
      else
        @ansible_variables = AnsibleVariable.where(:ansible_role_id => resource.all_ansible_roles, :override => true)
        @ansible_variables.values_hash(resource).raw
      end
    end

    def hostgroup_values_hash(hostgroup)
      @ansible_variables.each_with_object({}) do |ansvar, memo|
        next memo unless ansvar.override
        hash_result = inherited_hostgroup_value(hostgroup, ansvar)
        next memo unless hash_result
        memo[ansvar.id] = {
          ansvar.key => {
            :value => hash_result[:lookup_value].value,
            :element => 'hostgroup',
            :element_name => hash_result[:hostgroup].name
          }
        }
        memo
      end
    end

    def inherited_hostgroup_value(hostgroup, ansvar)
      return if !ansvar.path_elements.flatten.include?('hostgroup') && !Setting['matchers_inheritance']

      value = nil
      matched_hg = hostgroup.path.reverse.find do |hg|
        value = LookupValue.find_by(:lookup_key_id => ansvar.id, :id => hg.lookup_values)
      end

      return unless value
      { :lookup_value => value, :hostgroup => matched_hg }
    end
  end
end
