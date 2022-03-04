module Types
  class InheritedAnsibleRole < ::Types::AnsibleRole
    field :inherited, Boolean, :null => false

    def self.record_for(object)
      object.ansible_role
    end

    def object_class
      object.ansible_role.class
    end

    def load_object
      object.ansible_role
    end
  end
end
