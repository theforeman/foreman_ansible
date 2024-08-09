require 'test_plugin_helper'

class UIAnsibleRolesControllerTest < ActionController::TestCase
  setup do
    @role = FactoryBot.create(:ansible_role)
  end

  test 'should respond with roles' do
    get :index, :params => {}, :session => set_session_user
    assert_response :success
    res = JSON.parse @response.body
    assert_equal res['total'], res['results'].size
  end
end
