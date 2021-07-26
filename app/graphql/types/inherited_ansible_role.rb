module Types
  class InheritedAnsibleRole < ::Types::AnsibleRole
    field :inherited, Boolean, :null => false

    def object_class
      object.ansible_role.class
    end

    def load_object
      object.ansible_role
    end
  end
end
