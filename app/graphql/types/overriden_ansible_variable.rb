module Types
  class OverridenAnsibleVariable < ::Types::AnsibleVariable
    description 'Ansible Variable with an override value for a host'
    model_class ::AnsibleVariable

    field :current_value, ::Types::AnsibleVariableOverride, :null => true
    field :lookup_values, ::Types::LookupValue.connection_type, resolve: proc { |object|
      CollectionLoader.for(object.ansible_variable.class, :lookup_values).load(object.ansible_variable)
    }
  end
end
