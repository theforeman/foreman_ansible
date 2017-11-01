require 'test_plugin_helper'

module Api
  module V2
    # Tests for the controller to CRUD Ansible Roles
    class AnsibleRolesControllerTest < ActionController::TestCase
      setup do
        @role = FactoryBot.create(:ansible_role)
      end

      test 'should get index' do
        get :index, {}, set_session_user
        response = JSON.parse(@response.body)
        refute_empty response['results']
        assert_response :success
      end

      test 'should destroy' do
        delete :destroy, { :id => @role.id }, set_session_user
        assert_response :ok
        refute AnsibleRole.exists?(@role.id)
      end
    end
  end
end
