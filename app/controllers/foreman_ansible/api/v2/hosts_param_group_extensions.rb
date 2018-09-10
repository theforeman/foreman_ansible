# frozen_string_literal: true

module ForemanAnsible
  module Api
    module V2
      # Extends the hosts api controller to support creating/updating with roles
      module HostsParamGroupExtensions
        extend Apipie::DSL::Concern

        update_api(:create, :update) do
          param :host, Hash do
            param :ansible_role_ids, Array,
                  :desc => N_('IDs of associated ansible roles')
          end
        end
      end
    end
  end
end
