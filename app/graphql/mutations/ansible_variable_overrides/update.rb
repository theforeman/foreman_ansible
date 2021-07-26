module Mutations
  module AnsibleVariableOverrides
    class Update < ::Mutations::UpdateMutation
      graphql_name 'UpdateAnsibleVariableOverrideMutation'
      description 'Updates Ansible Variable Override'

      resource_class LookupValue

      argument :value, ::Types::RawJson, required: true
      argument :match, String, required: false
      argument :omit, Boolean, required: false
      argument :host_id, Int, required: true
      argument :ansible_variable_id, Int, required: true

      field :overriden_ansible_variable, ::Types::OverridenAnsibleVariable, :null => true

      def resolve(host_id:, ansible_variable_id:, **kwargs)
        result = super kwargs
        host = Host.find host_id
        vars = AnsibleVariable.where :id => ansible_variable_id
        resolver = ::ForemanAnsible::OverrideResolver.new(host, vars.pluck(:id))
        result.merge :overriden_ansible_variable => ::Presenters::OverridenAnsibleVariablePresenter.new(vars.first, resolver)
      end
    end
  end
end
