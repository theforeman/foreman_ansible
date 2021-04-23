module Types
  class AnsibleVariable < BaseObject
    description 'Ansible Variable'

    global_id_field :id

    field :key, String
    field :override, Boolean
    field :description, String
    field :hidden_value, Boolean
    field :parameter_type, String
    field :omit, Boolean
    field :required, Boolean
    field :validator_type, String
    field :validator_rule, String
    field :default_value, ::Types::RawJson
  end
end
