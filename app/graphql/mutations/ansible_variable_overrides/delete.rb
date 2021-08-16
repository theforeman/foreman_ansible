module Mutations
  module AnsibleVariableOverrides
    class Delete < ::Mutations::DeleteMutation
      graphql_name 'DeleteAnsibleVariableOverride'
      description 'Deletes Ansible Variable Override'

      resource_class LookupValue

      argument :host_id, Int, required: true
      argument :variable_id, Int, required: true

      field :overriden_ansible_variable, ::Types::OverridenAnsibleVariable, :null => true

      def resolve(id:, host_id:, variable_id:)
        host = Host.find_by :id => host_id
        var = AnsibleVariable.find_by :id => variable_id
        return resource_not_found(_('Host not found by id: %s'), host_id) unless host
        return resource_not_found(_('Ansible Variable not found by id: %s'), variable_id) unless var
        authorize!(host, :view)
        authorize!(var, :edit)

        res = super id: id
        resolver = ::ForemanAnsible::OverrideResolver.new(host, [var])
        res.merge :overriden_ansible_variable => ::OverridenAnsibleVariablePresenter.new(var, resolver)
      end

      def resource_not_found(message)
        {
          :overriden_ansible_variable => nil,
          :errros => [{
            :path => ['base'],
            :message => message
          }]
        }
      end
    end
  end
end
