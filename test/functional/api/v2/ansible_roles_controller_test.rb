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

      context 'proxy API calls' do
        setup do
          roles = ['some_role.some_author', 'test_role.test_author']
          ProxyAPI::Ansible.any_instance.expects(:roles).returns(roles)
          @proxy = FactoryBot.create(:smart_proxy, :with_ansible)
        end

        test 'should import' do
          put :import, :params => {
            :proxy_id => @proxy.id
          }, :session => set_session_user
          assert_response :success
        end

        test 'should obsolete' do
          put :obsolete, :params => {
            :proxy_id => @proxy.id
          }, :session => set_session_user
          assert_response :success
        end

        test 'should fetch' do
          @controller = Api::V2::AnsibleRolesController.new
          @controller.stubs(:prepare_ansible_import_rows).returns(
            [{
              :name => 'test_user.test_name',
              :id => nil,
              :role_action => 'Import Role',
              :variables => 'Add: 7',
              :hosts_count => '',
              :hostgroup_count => '',
              :kind => 'new'
            },
             {
               :name => 'some_user.some_role',
               :id => nil,
               :role_action => 'Import Role',
               :variables => 'Add: 3',
               :hosts_count => '',
               :hostgroup_count => '',
               :kind => 'new'
             }]
          )

          get :fetch, :params => {
            :proxy_id => @proxy.id
          }, :session => set_session_user
          response = JSON.parse(@response.body)
          assert_not_empty response['results']
          assert_response :success
        end
      end
    end
  end
end
