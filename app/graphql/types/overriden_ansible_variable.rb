module Types
  class OverridenAnsibleVariable < ::Types::AnsibleVariable
    description 'Ansible Variable with an override value for a host'
    model_class ::AnsibleVariable

    field :current_value, ::Types::AnsibleVariableOverride, :null => true
    field :lookup_values, ::Types::LookupValue.connection_type do
      argument :match, String, required: false
    end

    field :meta, ::Types::Meta

    def meta
      {
        :can_edit => ::User.current.can?(object.ansible_variable.permission_name(:edit), object.ansible_variable),
        :can_destroy => ::User.current.can?(object.ansible_variable.permission_name(:destroy), object.ansible_variable)
      }
    end

    def lookup_values(match: nil)
      return CollectionLoader.for(object.ansible_variable.class, :lookup_values).load(object.ansible_variable) unless match

      scope = lambda do |sc|
        sc.where(:match => match)
      end
      CollectionLoader.for(object.ansible_variable.class, :lookup_values, scope).load(object.ansible_variable)
    end
  end
end
