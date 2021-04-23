module Types
  class AnsibleVariableOverride < GraphQL::Types::Relay::BaseObject
    description 'Ovarride value for Ansible Variable'

    field :value, ::Types::RawJson, :null => false
    field :element, ::Types::RawJson, :null => false
    field :element_name, ::Types::RawJson, :null => false
  end
end
