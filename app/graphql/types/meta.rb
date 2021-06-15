module Types
  class Meta < GraphQL::Schema::Object
    field :can_edit, Boolean, :null => false
  end
end
