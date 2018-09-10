# frozen_string_literal: true

require 'test_plugin_helper'
# functional tests for AnsibleRolesController
class AnsibleRolesControllerTest < ActionController::TestCase
  setup do
    @role = FactoryBot.create(:ansible_role)
  end

  basic_index_test

  test 'should destroy role' do
    assert_difference('AnsibleRole.count', -1) do
      delete :destroy,
             :params => { :id => @role.id },
             :session => set_session_user
    end
    assert_redirected_to ansible_roles_url
  end
end
