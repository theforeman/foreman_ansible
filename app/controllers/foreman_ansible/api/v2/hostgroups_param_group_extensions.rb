# frozen_string_literal: true

module ForemanAnsible
  module Api
    module V2
      # Extends the hostgroups api controller to support creating with roles
      module HostgroupsParamGroupExtensions
        extend Apipie::DSL::Concern

        update_api(:create, :update) do
          param :hostgroup, Hash do
            param :ansible_role_ids, Array,
                  :desc => N_('IDs of associated ansible roles')
          end
        end
      end
    end
  end
end
