# frozen_string_literal: true

require 'test_plugin_helper'

module Api
  module V2
    # Tests for the controller to CRUD Ansible Roles
    class AnsibleRolesControllerTest < ActionController::TestCase
      setup do
        @role = FactoryBot.create(:ansible_role)
      end

      test 'should get index' do
        get :index, :session => set_session_user
        response = JSON.parse(@response.body)
        refute_empty response['results']
        assert_response :success
      end

      test 'should destroy' do
        delete :destroy,
               :params => { :id => @role.id },
               :session => set_session_user
        assert_response :ok
        refute AnsibleRole.exists?(@role.id)
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
    end
  end
end
