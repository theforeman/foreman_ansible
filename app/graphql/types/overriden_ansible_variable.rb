module Types
  class OverridenAnsibleVariable < ::Types::AnsibleVariable
    description 'Ansible Variable with an override value for a host'
    model_class ::AnsibleVariable

    field :current_value, ::Types::AnsibleVariableOverride, :null => true
  end
end
