module Mutations
  module AnsibleVariableOverrides
    class Create < ::Mutations::CreateMutation
      graphql_name 'CreateAnsibleVariableOverrideMutation'
      description 'Creates Ansible Variable Override'

      resource_class LookupValue

      argument :host_id, Int, required: true
      argument :lookup_key_id, Int, required: true
      argument :value, ::Types::RawJson, required: true
      argument :match, String, required: true
      argument :omit, Boolean

      field :overriden_ansible_variable, ::Types::OverridenAnsibleVariable, :null => true

      def resolve(host_id:, **kwargs)
        result = super kwargs
        host = Host.find host_id
        vars = AnsibleVariable.where :id => kwargs[:lookup_key_id]
        resolver = ::ForemanAnsible::OverrideResolver.new(host, vars)
        result.merge :overriden_ansible_variable => ::Presenters::OverridenAnsibleVariablePresenter.new(vars.first, resolver)
      end
    end
  end
end
