require 'test_plugin_helper'

module Api
  module V2
    class HostsControllerTest < ActionController::TestCase
      include ::Dynflow::Testing

      setup do
        @host1 = FactoryGirl.create(:host)
        @host2 = FactoryGirl.create(:host)
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
    end
  end
end
