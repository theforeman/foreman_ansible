require 'test_plugin_helper'

module Queries
  class HostAnsibleRolesQueryTest < GraphQLQueryTestCase
    let(:role1) { FactoryBot.create(:ansible_role) }
    let(:role2) { FactoryBot.create(:ansible_role) }
    let(:hostgroup) { FactoryBot.create(:hostgroup, ansible_roles: [role1]) }
    let(:host) { FactoryBot.create(:host, hostgroup: hostgroup, ansible_roles: [role2]) }
    let(:variables) { { id: Foreman::GlobalId.for(host) } }
    let(:query) do
      <<-GRAPHQL
      query ($id: String!) {
        host(id: $id) {
          id
          allAnsibleRoles {
            totalCount
            nodes {
              id
              name
              inherited
              ansibleVariables {
                totalCount
                nodes {
                  key
                  override
                }
              }
            }
          }
        }
      }
      GRAPHQL
    end

    context 'with admin permissions' do
      let(:context_user) { FactoryBot.create(:user, :admin) }
      let(:data) { result['data']['host']['allAnsibleRoles'] }

      it 'allows to fetch inherited roles' do
        value(data['totalCount']).must_equal(2)
        r1_data = data['nodes'].first
        r2_data = data['nodes'].second
        value(r1_data['name']).must_equal(role1.name)
        value(r1_data['inherited']).must_equal(true)
        value(r2_data['name']).must_equal(role2.name)
        value(r2_data['inherited']).must_equal(false)
      end

      it 'allow fetching variables' do
        var1 = FactoryBot.create(:ansible_variable, ansible_role: role1, override: true)
        FactoryBot.create(:ansible_variable, ansible_role: role1)
        FactoryBot.create(:ansible_variable, ansible_role: role2, override: true)
        r1_vars = data['nodes'].first['ansibleVariables']
        r2_vars = data['nodes'].second['ansibleVariables']
        value(r1_vars['totalCount']).must_equal(2)
        value(r2_vars['totalCount']).must_equal(1)
        value(r1_vars['nodes'].first['key']).must_equal(var1.key)
      end
    end
  end
end
