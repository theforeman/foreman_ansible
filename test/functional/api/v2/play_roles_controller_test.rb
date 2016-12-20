require 'test_plugin_helper'

module Api
  module V2
    class PlayRolesControllerTest < ActionController::TestCase
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

      test 'should return an error due to invalid format' do
        post :play_roles_on_host, :host_ids => [@host1.id]
        response = JSON.parse(@response.body)
        refute_empty response
        assert_response :error
      end

      test 'should return an error due to non-existent host_id' do
        params = { :host_ids => ['non-existent'] }
        post :play_roles_on_host, :play_roles => params
        response = JSON.parse(@response.body)
        refute_empty response
        assert_response :error
      end

      test 'should return an error due to non-existent host_name' do
        params = { :host_names => ['non-existent'] }
        post :play_roles_on_host, :play_roles => params
        response = JSON.parse(@response.body)
        refute_empty response
        assert_response :error
      end

      test 'should trigger task on host' do
        # also testing if controller filters out same hosts passed in
        # multiple times
        params = {
          :host_names => [@host1.name, @host1.name],
          :host_ids => [@host1.id]
        }

        post :play_roles_on_host, :play_roles => params
        response = JSON.parse(@response.body)

        assert response.length == 1, 'should only trigger one task'
        assert response.first.key?('host'),
               'host not contained as a key in response'
        assert response.first.key?('foreman_tasks'),
               'foreman_tasks not contained as a key in response'
        assert response.first['foreman_tasks'].key?('id'),
               'task id not contained as a key in response'
        assert_equal response.first['host']['name'],
                     @host1.name,
                     'host name not contained in response'
        assert_response :success
      end

      test 'should trigger two host tasks' do
        params = {
          :host_names => [@host1.name, @host2.name]
        }
        post :play_roles_on_host, :play_roles => params
        response = JSON.parse(@response.body)

        assert response.length == 2, 'should trigger two tasks'
        assert_response :success
      end

      test 'should trigger task on hostgroup' do
        # also testing if controller filters out same hosts passed in
        # multiple times
        params = {
          :hostgroup_names => [@host1.hostgroup.name],
          :hostgroup_ids => [@host1.hostgroup.id]
        }

        post :play_roles_on_hostgroup, :play_roles => params
        response = JSON.parse(@response.body)

        assert response.length == 1, 'should only trigger one task'
        assert response.first.key?('hostgroup'),
               'hostgroup not contained as a key in response'
        assert response.first.key?('foreman_tasks'),
               'foreman_tasks not contained as a key in response'
        assert response.first['foreman_tasks'].key?('id'),
               'task id not contained as a key in response'
        assert_equal response.first['hostgroup']['name'],
                     @host1.hostgroup.name,
                     'hostgroup name not contained in response'
        assert_response :success
      end

      test 'should trigger two hostgroup tasks' do
        params = {
          :hostgroup_ids => [@host1.hostgroup.id, @host2.hostgroup.id]
        }

        post :play_roles_on_hostgroup, :play_roles => params
        response = JSON.parse(@response.body)

        assert response.length == 2, 'should trigger two tasks'
        assert_response :success
      end
    end
  end
end
