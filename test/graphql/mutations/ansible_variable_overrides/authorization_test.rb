# frozen_string_literal: true

require 'test_plugin_helper'

module Mutations
  module AnsibleVariableOverrides
    class AuthorizationTest < GraphQLQueryTestCase
      let(:host) { as_admin { FactoryBot.create(:host, :ansible_roles => [variable.ansible_role]) } }
      let(:variable) { as_admin { FactoryBot.create(:ansible_variable, :override => true) } }
      let(:lookup_value) do
        as_admin do
          FactoryBot.create(
            :lookup_value,
            :lookup_key => variable,
            :match => "fqdn=#{host.name}",
            :value => 'old value'
          )
        end
      end
      let(:context_user) { user_with_permissions(:edit_ansible_variables, :view_hosts) }

      def user_with_permissions(*permissions)
        as_admin do
          role = FactoryBot.create(:role)
          role.add_permissions!(permissions)
          user = FactoryBot.create(:user)
          user.roles << role
          user
        end
      end

      context 'when creating an override' do
        let(:query) do
          <<-GRAPHQL
            mutation CreateOverride($hostId: Int!, $lookupKeyId: Int!, $match: String!, $value: RawJson!) {
              createAnsibleVariableOverride(input: {
                hostId: $hostId,
                lookupKeyId: $lookupKeyId,
                match: $match,
                value: $value
              }) {
                errors { path message }
              }
            }
          GRAPHQL
        end
        let(:variables) do
          {
            :hostId => host.id,
            :lookupKeyId => variable.id,
            :match => "fqdn=#{host.name}",
            :value => 'new value'
          }
        end

        test 'requires only edit ansible variables permission' do
          assert_empty result['errors']
          assert_empty result['data']['createAnsibleVariableOverride']['errors']
          assert_equal 'new value', variable.reload.lookup_values.find_by(:match => "fqdn=#{host.name}").value
        end
      end

      context 'when updating an override' do
        let(:query) do
          <<-GRAPHQL
            mutation UpdateOverride($id: ID!, $hostId: Int!, $ansibleVariableId: Int!, $value: RawJson!) {
              updateAnsibleVariableOverride(input: {
                id: $id,
                hostId: $hostId,
                ansibleVariableId: $ansibleVariableId,
                value: $value
              }) {
                errors { path message }
              }
            }
          GRAPHQL
        end
        let(:variables) do
          {
            :id => Foreman::GlobalId.for(lookup_value),
            :hostId => host.id,
            :ansibleVariableId => variable.id,
            :value => 'new value'
          }
        end

        test 'requires only edit ansible variables permission' do
          assert_empty result['errors']
          assert_empty result['data']['updateAnsibleVariableOverride']['errors']
          assert_equal 'new value', lookup_value.reload.value
        end

        test 'rejects lookup values belonging to another lookup key type' do
          other_value = as_admin { FactoryBot.create(:lookup_value, :match => "fqdn=#{host.name}") }
          variables[:id] = Foreman::GlobalId.for(other_value)

          assert_includes result['errors'].map { |error| error['message'] },
            'Ansible variable overrides can only be changed for Ansible variables.'
        end
      end

      context 'when deleting an override' do
        let(:query) do
          <<-GRAPHQL
            mutation DeleteOverride($id: ID!, $hostId: Int!, $variableId: Int!) {
              deleteAnsibleVariableOverride(input: {
                id: $id,
                hostId: $hostId,
                variableId: $variableId
              }) {
                errors { path message }
              }
            }
          GRAPHQL
        end
        let(:variables) do
          {
            :id => Foreman::GlobalId.for(lookup_value),
            :hostId => host.id,
            :variableId => variable.id
          }
        end

        test 'requires only edit ansible variables permission' do
          assert_empty result['errors']
          assert_empty result['data']['deleteAnsibleVariableOverride']['errors']
          refute LookupValue.exists?(lookup_value.id)
        end
      end
    end
  end
end
