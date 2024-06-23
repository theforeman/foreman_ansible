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

      test 'should convert yaml to json' do
        test_yaml = "---\nvar_0: \"test_string\"\n"

        testyaml64 = Base64.encode64 test_yaml
        put :yaml_to_json, :params => { :data => testyaml64 }, :session => set_session_user
        assert_response :success
        assert_equal({ 'var_0' => { 'value' => 'test_string', 'type' => 'string' } }, JSON.parse(@response.body))
      end

      test 'should import from json' do
        put :from_json, :params => {
          "data": {
            "#{FactoryBot.create(:ansible_role).name}": {
              "some_variable": {
                "value": 'test_value',
                "type": 'string'
              }
            }
          }
        }, :session => set_session_user
        assert_response :success
      end

      test 'should reject if role does not exist' do
        put :from_json, :params => {
          "data": {
            "non_existent_role": {
              "some_variable": {
                "value": 'test_value',
                "type": 'string'
              }
            }
          }
        }, :session => set_session_user
        assert_response 422
        assert_equal({ 'error' => { 'message' => 'non_existent_role does not exist' } },
                     JSON.parse(@response.body))
      end
    end
  end
end
