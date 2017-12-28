require 'test_plugin_helper'
require 'dynflow/testing'

module Api
  module V2
    # Tests for the extra methods to play roles on Hostgroup
    class HostgroupsControllerTest < ActionController::TestCase
      setup do
        @host1 = FactoryBot.create(:host, :with_hostgroup)
        @host2 = FactoryBot.create(:host, :with_hostgroup)
      end

      test 'should return an not_found due to non-existent host_id' do
        post :play_roles, :params => { :id => 'non-existent' }
        response = JSON.parse(@response.body)
        refute_empty response
        assert_response :not_found
      end

      test 'should trigger task on host group' do
        load File.join(ForemanAnsible::Engine.root,
                       '/db/seeds.d/75_job_templates.rb')
        ::JobInvocationComposer.any_instance.expects(:trigger!).returns(true)
        target = @host1
        post :play_roles, :params => { :id => target.hostgroup.id }
        response = JSON.parse(@response.body)
        assert_job_invocation_is_ok(response, target.id)
      end

      test 'should trigger two host group tasks' do
        load File.join(ForemanAnsible::Engine.root,
                       '/db/seeds.d/75_job_templates.rb')
        ::JobInvocationComposer.any_instance.expects(:trigger!).returns(true)
        target = [@host1, @host2]
        post :multiple_play_roles, :params => {
          :hostgroup_ids => target.map(&:hostgroup_id)
        }
        response = JSON.parse(@response.body)
        assert_job_invocation_is_ok(response, target.map(&:id))
      end
    end
  end
end
