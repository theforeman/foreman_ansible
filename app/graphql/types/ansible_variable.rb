module Types
  class AnsibleVariable < BaseObject
    description 'Ansible Variable'

    global_id_field :id

    field :key, String
    field :path, resolver: Resolvers::AnsibleVariable::Path
    field :override, Boolean
    field :description, String
    field :hidden_value, Boolean
    field :parameter_type, String
    field :omit, Boolean
    field :required, Boolean
    field :validator_type, String
    field :validator_rule, String
    field :default_value, ::Types::RawJson
    field :ansible_role_name, String

    def ansible_role_name
      object.ansible_role.name
    end
  end
end
