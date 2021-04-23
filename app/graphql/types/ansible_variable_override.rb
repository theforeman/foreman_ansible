module Types
  class AnsibleVariableOverride < GraphQL::Types::Relay::BaseObject
    description 'Ovarride value for Ansible Variable'

    field :value, ::Types::RawJson, :null => false
    field :element, String, :null => false
    field :element_name, String, :null => false
  end
end
