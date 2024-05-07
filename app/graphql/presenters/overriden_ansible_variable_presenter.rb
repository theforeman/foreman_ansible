module Presenters
  class OverridenAnsibleVariablePresenter
    attr_reader :ansible_variable

    delegate :id, :key, :description,
             :parameter_type, :omit, :required,
             :validator_type, :validator_rule,
             :ansible_role, :current_value, :to => :ansible_variable
    def hidden_value
      ansible_variable.hidden_value?
    end

    def override
      ansible_variable.override?
    end

    def initialize(ansible_variable, override_resolver)
      @ansible_variable = ansible_variable
      @override_resolver = override_resolver
    end

    def default_value
      ansible_variable.editable_by_user? ? ansible_variable.default_value : '*****'
    end

    def current_value
      resolved = @override_resolver.resolve @ansible_variable
      unless resolved.nil?
        resolved[:value] = '*****' unless ansible_variable.editable_by_user?
      end
      resolved
    end
  end
end
