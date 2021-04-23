require 'test_plugin_helper'

module Queries
  class VariableOverridesQueryTest < GraphQLQueryTestCase
    let(:query) do
      <<-GRAPHQL
        query($id: String!, $hostId: Int!) {
          host(id: $id) {
            allAnsibleRoles {
              nodes {
                name
                ansibleVariablesWithOverrides(hostId: $hostId) {
                  nodes {
                    key
                    defaultValue
                    parameterType
                    currentValue {
                      value
                      element
                      elementName
                    }
                  }
                }
              }
            }
          }
        }
      GRAPHQL
    end

    let(:host) { FactoryBot.create(:host) }
    let(:global_id) { Foreman::GlobalId.for(host) }

    let(:data) { result['data']['host'] }
    let(:variables) { { :id => global_id, :hostId => host.id } }

    setup do
      role = FactoryBot.create(:ansible_role)
      var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => role)
      FactoryBot.create(:host_ansible_role, :host => host, :ansible_role => role)
      @override = FactoryBot.create(:lookup_value, :lookup_key => var, :match => "fqdn=#{host.name}")
    end

    test 'should fetch variables with overrides' do
      assert_empty result['errors']
      assert_equal @override.value, data['allAnsibleRoles']['nodes'].first['ansibleVariablesWithOverrides']['nodes'].first['currentValue']['value']
    end
  end
end
