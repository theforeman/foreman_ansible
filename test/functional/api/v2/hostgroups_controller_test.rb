require 'test_plugin_helper'
require 'dynflow/testing'

module Api
  module V2
    class HostgroupsControllerTest < ActionController::TestCase
      include ::Dynflow::Testing

      setup do
        @role = FactoryGirl.create(:ansible_role)
        @host1 = FactoryGirl.create(:host, :with_hostgroup)
        @host2 = FactoryGirl.create(:host, :with_hostgroup)
        @host1.hostgroup.ansible_roles = [@role]
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

      test 'should trigger task on host group' do
        post :play_roles, :id => @host1.hostgroup.id
        response = JSON.parse(@response.body)

        assert response['message']['foreman_tasks'].key?('id'),
               'task id not contained in response'
        assert_equal response['message']['hostgroup']['name'],
                     @host1.hostgroup.name,
                     'host group name not contained in response'
        assert_response :success
      end

      test 'should trigger two host group tasks' do
        post :multiple_play_roles,
             :hostgroup_names => [@host1.hostgroup.name, @host2.hostgroup.name]
        response = JSON.parse(@response.body)

        assert response['message'].length == 2, 'should trigger two tasks'
        assert_response :success
      end

      test 'should list assigned role on host group' do
        get :list_ansible_roles, :id => @host1.hostgroup.id
        response = JSON.parse(@response.body)

        assert_equal response['message']['roles'][0]['id'],
                     @role.id
                     'assigned role not in role list'
        assert_response :success
      end

      test 'unassign and assign a role to a host group' do
        post :ansible_roles, :id => @host1.hostgroup.id, :roles => []
        response = JSON.parse(@response.body)

        assert response['message']['roles'].empty?,
               'host group role could not be unassigned'
        assert_response :success

        post :ansible_roles, :id => @host1.hostgroup.id, :roles => [@role.id]
        response = JSON.parse(@response.body)

        assert_equal response['message']['roles'][0]['id'],
                     @role.id
                     'host group role could not be assigned'
        assert_response :success
      end
    end
  end
end
