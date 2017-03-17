require 'test_plugin_helper'

module Api
  module V2
    class HostsControllerTest < ActionController::TestCase
      include ::Dynflow::Testing

      setup do
        @host1 = FactoryGirl.create(:host, :with_hostgroup)
        @host2 = FactoryGirl.create(:host)
        @role1 = FactoryGirl.create(:ansible_role)
        @role2 = FactoryGirl.create(:ansible_role)
        @host1.ansible_roles           = [@role1]
        @host1.hostgroup.ansible_roles = [@role2]
      end

      after do
        ::ForemanTasks::Task::DynflowTask.all.each do |task|
          task.destroy
          task.delete
        end
      end

      test 'should return an not_found due to non-existent host_id' do
        post :play_roles, :id => 'non-existent'
        response = JSON.parse(@response.body)
        refute_empty response
        assert_response :not_found
      end

      test 'should trigger task on host' do
        post :play_roles, :id => @host1.id
        response = JSON.parse(@response.body)

        assert response['message']['foreman_tasks'].key?('id'),
               'task id not contained in response'
        assert_equal response['message']['host']['name'],
                     @host1.name,
                     'host name not contained in response'
        assert_response :success
      end

      test 'should trigger two host tasks' do
        post :multiple_play_roles, :id => [@host1.id, @host2.id]
        response = JSON.parse(@response.body)

        assert response['message'].length == 2, 'should trigger two tasks'
        assert_response :success
      end

      test 'should list assigned roles on host' do
        get :list_ansible_roles, :id => @host1.id
        response = JSON.parse(@response.body)

        assert_equal response['message']['ansible_roles'][0]['id'],
                     @role1.id
                     'assigned role not in role list'
        assert_equal response['message']['inherited_ansible_roles'][0]['id'],
                     @role2.id
                     'inherited role not in role list'
        assert response['message']['all_ansible_roles'].length == 2,
               'not all assigned ansible roles listed'
        assert_response :success
      end

      test 'unassign and assign a role to a host' do
        post :ansible_roles, :id => @host1.id, :roles => []
        response = JSON.parse(@response.body)

        assert response['message']['roles'].empty?,
               'host role could not be unassigned'
        assert_response :success

        post :ansible_roles, :id => @host1.id, :roles => [@role1.id]
        response = JSON.parse(@response.body)

        assert_equal response['message']['roles'][0]['id'],
                     @role1.id
                     'host role could not be assigned'
        assert_response :success
      end
    end
  end
end
