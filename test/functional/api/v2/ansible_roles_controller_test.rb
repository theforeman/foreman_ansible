require 'test_plugin_helper'

module Api
  module V2
    class AnsibleRolesControllerTest < ActionController::TestCase
      setup do
        @role = FactoryGirl.create(:ansible_role)
      end

      test "should get index" do
        get :index, {}, set_session_user
        response = JSON.parse(@response.body)
        assert response['results'].length > 0
        assert_response :success
      end

      test "should destroy" do
        delete :destroy, { :id => @role.id }, set_session_user
        assert_response :ok
        refute AnsibleRole.exists?(@role.id)
      end
    end
  end
end
