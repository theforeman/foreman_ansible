require 'test_plugin_helper'

module Api
  module V2
    class HostgroupsControllerTest < ActionController::TestCase
      include ::Dynflow::Testing

      setup do
        @host1 = FactoryGirl.create(:host, :with_hostgroup)
        @host2 = FactoryGirl.create(:host, :with_hostgroup)
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
    end
  end
end
