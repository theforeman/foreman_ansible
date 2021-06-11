module Mutations
  module AnsibleVariableOverrides
    class Delete < ::Mutations::DeleteMutation
      graphql_name 'DeleteAnsibleVariableOverride'
      description 'Deletes Ansible Variable Override'

      resource_class LookupValue

      argument :host_id, Int, required: true
      argument :variable_id, Int, required: true

      field :overriden_ansible_variable, ::Types::OverridenAnsibleVariable, :null => false

      def resolve(id:, host_id:, variable_id:)
        res = super id: id
        host = Host.find host_id
        vars = AnsibleVariable.where :id => variable_id
        resolver = ::ForemanAnsible::OverrideResolver.new(host, vars)
        res.merge :overriden_ansible_variable => ::OverridenAnsibleVariablePresenter.new(vars.first, resolver)
      end
    end
  end
end
