require 'test_plugin_helper'

module Queries
  class AnsibleRolesQueryTest < GraphQLQueryTestCase
    let(:query) do
      <<-GRAPHQL
      query {
        ansibleRoles {
          totalCount
          nodes {
            id
            name
          }
        }
      }
      GRAPHQL
    end

    let(:data) { result['data']['ansibleRoles'] }

    setup do
      FactoryBot.create_list(:ansible_role, 2)
    end

    test 'should fetch Ansible roles' do
      assert_empty result['errors']

      expected_count = AnsibleRole.count

      assert_not_equal 0, expected_count
      assert_equal expected_count, data['totalCount']
      assert_equal expected_count, data['nodes'].count
    end
  end
end
