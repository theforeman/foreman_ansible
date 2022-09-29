module Types
  class AnsibleVariableOverride < GraphQL::Schema::Object
    description 'Override value for Ansible Variable'

    field :value, ::Types::RawJson, :null => false
    field :element, ::Types::RawJson, :null => false
    field :element_name, ::Types::RawJson, :null => false
  end
end
