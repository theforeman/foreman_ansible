require 'test_plugin_helper'

module Api
  module V2
    class VcsCloneControllerTest < ActionController::TestCase
      describe 'input' do
        test 'handles missing proxy capability' do
          proxy = FactoryBot.create(:smart_proxy, :with_ansible)

          get :repository_metadata,
              params: { id: proxy.id, vcs_url: 'https://github.com/theforeman/foreman_ansible.git' },
              session: set_session_user

          response = JSON.parse(@response.body)
          assert_response :bad_request
          assert_equal({ 'error' =>
                           { 'message' => 'Smart Proxy is missing foreman_ansible installation or Git cloning capability' } }, response)
        end
      end
      describe '#repo_information' do
        test 'requests repo information' do
          proxy = FactoryBot.create(:smart_proxy, :with_ansible)
          SmartProxy.any_instance.stubs(:has_capability?).returns(true)
          ProxyAPI::Ansible.any_instance.expects(:repo_information).returns({
                                                                              'head' => {},
                                                                              'branches' => {},
                                                                              'tags' => {},
                                                                              'vcs_url' => 'https://github.com/theforeman/foreman_ansible.git'
                                                                            })

          get :repository_metadata,
              params: { id: proxy.id, vcs_url: 'https://github.com/theforeman/foreman_ansible.git' },
              session: set_session_user

          response = JSON.parse(@response.body)
          assert_response :success
          assert_equal({ 'head' => {},
                         'branches' => {},
                         'tags' => {},
                         'vcs_url' => 'https://github.com/theforeman/foreman_ansible.git' }, response)
        end
      end
      describe '#installed_roles' do
        test 'requests installed roles' do
          proxy = FactoryBot.create(:smart_proxy, :with_ansible)
          SmartProxy.any_instance.stubs(:has_capability?).returns(true)
          ProxyAPI::Ansible.any_instance.expects(:list_installed).returns(%w[role1 role2])

          get :installed_roles,
              params: { id: proxy.id },
              session: set_session_user

          response = JSON.parse(@response.body)
          assert_response :success
          assert_equal(%w[role1 role2], response)
        end
      end
      describe '#install_role' do
        test 'installes a role' do
          proxy = FactoryBot.create(:smart_proxy, :with_ansible)
          SmartProxy.any_instance.stubs(:has_capability?).returns(true)

          post :install_role,
               params: { id: proxy.id, repo_info: {
                 'vcs_url' => 'https://github.com/theforeman/foreman_ansible.git',
                 'role_name' => 'best.role.ever',
                 'ref' => 'master'
               } },
               session: set_session_user
          assert_response :success
        end
        test 'handles faulty parameters' do
          proxy = FactoryBot.create(:smart_proxy, :with_ansible)
          SmartProxy.any_instance.stubs(:has_capability?).returns(true)

          post :install_role,
               params: { id: proxy.id, 'repo_info': {
                 'vcs_urll' => 'https://github.com/theforeman/foreman_ansible.git',
                 'role_name' => 'best.role.ever',
                 'ref' => 'master'
               } },
               session: set_session_user
          response = JSON.parse(@response.body)
          assert_response :bad_request
          assert_equal({ 'error' => 'param is missing or the value is empty: vcs_url' }, response)
        end
      end
      describe '#update_role' do
        # With the difference of the http-method being PUT, this is
        # identical to #install_role
      end
      describe '#delete_role' do
        test 'deletes a role' do
          proxy = FactoryBot.create(:smart_proxy, :with_ansible)
          SmartProxy.any_instance.stubs(:has_capability?).returns(true)

          delete :delete_role,
                 params: { id: proxy.id, role_name: 'best.role.ever' },
                 session: set_session_user
          assert_response :success
        end
      end
    end
  end
end
