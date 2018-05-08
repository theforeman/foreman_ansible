require 'test_plugin_helper'
# functional tests for AnsibleVariablesController
class AnsibleVariablesControllerTest < ActionController::TestCase
  setup do
    @model = FactoryBot.create(:ansible_variable)
  end

  basic_index_test
  basic_edit_test @variable
  basic_pagination_per_page_test
  basic_pagination_rendered_test

  test 'should destroy variable' do
    assert_difference('AnsibleVariable.count', -1) do
      delete :destroy,
             :params => { :id => @model.id },
             :session => set_session_user
    end
    assert_redirected_to ansible_variables_url
  end

  test 'there are no problems when the import hash is empty' do
    ForemanAnsible::VariablesImporter.any_instance.
      expects(:import_variable_names).returns({})
    ForemanAnsible::UiRolesImporter.any_instance.
      expects(:import_role_names).returns({})

    proxy = FactoryBot.create(:smart_proxy, :with_ansible)
    get :import,
        :params => { :proxy => proxy.id },
        :session => set_session_user
    assert_response :success
  end
end
