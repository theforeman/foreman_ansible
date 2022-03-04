module Presenters
  class AnsibleRolePresenter
    attr_reader :ansible_role, :inherited

    delegate :id, :name, :association, :to => :ansible_role

    def self.graphql_type
      'Types::InheritedAnsibleRole'
    end

    def initialize(ansible_role, inherited)
      @ansible_role = ansible_role
      @inherited = inherited
    end
  end
end
