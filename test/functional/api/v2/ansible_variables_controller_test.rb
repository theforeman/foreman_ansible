# frozen_string_literal: true

require 'test_plugin_helper'

module Api
  module V2
    # Tests for the controller to CRUD Ansible Variables
    class AnsibleVariablesControllerTest < ActionController::TestCase
      setup do
        @variable = FactoryBot.create(:ansible_variable)
      end

      test 'should get index' do
        get :index, :session => set_session_user
        response = JSON.parse(@response.body)
        refute_empty response['results']
        assert_response :success
      end

      test 'should destroy' do
        delete :destroy,
               :params => { :id => @variable.id },
               :session => set_session_user
        assert_response :ok
        refute AnsibleVariable.exists?(@variable.id)
      end

      test 'should import' do
        put :import,
            :session => set_session_user
        assert_response :success
      end

      test 'should obsolete' do
        put :obsolete,
            :session => set_session_user
        assert_response :success
      end

      test 'should create' do
        params = { :key => 'test name', :ansible_role_id => FactoryBot.create(:ansible_role).id }
        post :create,
             :params => params,
             :session => set_session_user
        assert_response :success
        res = JSON.parse(@response.body)
        refute res['imported']
      end

      test 'should update' do
        variable = FactoryBot.create(:ansible_variable, :default_value => 'my default value')
        new_value = 'changed default value'
        post :update,
             :params => { :id => variable.id, :default_value => new_value },
             :session => set_session_user

        assert_response :success
        res = JSON.parse(@response.body)
        assert_equal new_value, res['default_value']
      end
    end
  end
end
