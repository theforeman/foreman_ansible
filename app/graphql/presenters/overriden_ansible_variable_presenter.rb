module Presenters
  class OverridenAnsibleVariablePresenter
    attr_reader :ansible_variable

    delegate :id, :key, :description, :override?,
             :parameter_type, :hidden_value?, :omit, :required,
             :validator_type, :validator_rule, :default_value,
             :ansible_role, :current_value, :to => :ansible_variable

    def initialize(ansible_variable, override_resolver)
      @ansible_variable = ansible_variable
      @override_resolver = override_resolver
    end

    def current_value
      @override_resolver.resolve @ansible_variable
    end
  end
end
