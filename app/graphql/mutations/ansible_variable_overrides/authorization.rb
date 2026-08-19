# frozen_string_literal: true

module Mutations
  module AnsibleVariableOverrides
    module Authorization
      private

      def authorize!(resource, action)
        return super unless resource.is_a?(LookupValue)

        variable = resource.lookup_key
        unless variable.is_a?(AnsibleVariable)
          raise GraphQL::ExecutionError.new(
            _('Ansible variable overrides can only be changed for Ansible variables.')
          )
        end

        super(variable, :edit)
      end
    end
  end
end
