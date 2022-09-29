require 'test_plugin_helper'

module Mutations
  module Hosts
    class CreateMutationTest < GraphQLQueryTestCase
      let(:tax_location) { as_admin { FactoryBot.create(:location) } }
      let(:location_id) { Foreman::GlobalId.for(tax_location) }
      let(:organization) { as_admin { FactoryBot.create(:organization) } }
      let(:organization_id) { Foreman::GlobalId.for(organization) }

      let(:role1) { as_admin { FactoryBot.create(:ansible_role) } }
      let(:role2) { as_admin { FactoryBot.create(:ansible_role) } }
      let(:role3) { as_admin { FactoryBot.create(:ansible_role) } }
      let(:host) { as_admin { FactoryBot.create(:host, :ansible_roles => [role1, role2, role3], :organization => organization, :location => tax_location) } }

      let(:variables) { { id: Foreman::GlobalId.for(host), ansibleRoleIds: [role3.id, role2.id, role1.id] } }
      let(:query) do
        <<-GRAPHQL
          mutation AssignAnsibleRoles($id: ID!, $ansibleRoleIds: [Int!]!) {
            assignAnsibleRoles(input: { id: $id, ansibleRoleIds: $ansibleRoleIds }) {
              host {
                id
                ownAnsibleRoles {
                  nodes {
                    id
                    name
                  }
                }
              }
              errors {
                path
                message
              }
            }
          }
        GRAPHQL
      end

      context 'with admin permissions' do
        let(:context_user) { as_admin { FactoryBot.create(:user, :admin) } }
        let(:data) { result['data']['assignAnsibleRoles']['host'] }

        it 'reorderes ansible roles' do
          assert_empty result['errors']
          assert_not_nil data
          assert_empty result['data']['assignAnsibleRoles']['errors']

          assert_equal([role3, role2, role1].map { |role| Foreman::GlobalId.for role }, data['ownAnsibleRoles']['nodes'].map { |node| node['id'] })
        end
      end

      context 'with edit permission' do
        let(:context_user) do
          setup_user('edit', 'hosts') do |user|
            user.roles << Role.find_by(name: 'Viewer')
          end
        end
        let(:data) { result['data']['assignAnsibleRoles']['host'] }
        let(:variables) { { id: Foreman::GlobalId.for(host), ansibleRoleIds: [role3.id, role2.id] } }

        before do
          Location.current = tax_location
          Organization.current = organization
        end

        it 'reorderes ansible roles' do
          assert_empty result['errors']
          assert_not_nil data
          assert_empty result['data']['assignAnsibleRoles']['errors']

          assert_equal([role3, role2].map { |role| Foreman::GlobalId.for role }, data['ownAnsibleRoles']['nodes'].map { |node| node['id'] })
        end
      end

      context 'with view only permissions' do
        let(:context_user) do
          setup_user('show', 'hosts') do |user|
            user.roles << Role.find_by(name: 'Viewer')
          end
        end

        before do
          Location.current = tax_location
          Organization.current = organization
        end

        test 'cannot create a host' do
          expected_error = 'Unauthorized. You do not have the required permission edit_hosts.'

          assert_not_empty result['errors']
          assert_includes result['errors'].map { |e| e['message'] }, expected_error
        end
      end
    end
  end
end
