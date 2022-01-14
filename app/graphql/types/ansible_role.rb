module Types
  class AnsibleRole < BaseObject
    description 'Ansible role'

    global_id_field :id

    field :name, String, :null => false
    field :path, resolver: Resolvers::AnsibleRole::Path
  end
end
