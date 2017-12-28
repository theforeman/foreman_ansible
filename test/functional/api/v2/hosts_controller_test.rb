require 'test_plugin_helper'

module Api
  module V2
    # Tests for the extra methods to play roles on a Host
    class HostsControllerTest < ActionController::TestCase
      setup do
        @host1 = FactoryBot.create(:host)
        @host2 = FactoryBot.create(:host)
      end

      test 'should return an not_found due to non-existent host_id' do
        post :play_roles, :params => { :id => 'non-existent' }
        response = JSON.parse(@response.body)
        refute_empty response
        assert_response :not_found
      end

      test 'should trigger task on host' do
        load File.join(ForemanAnsible::Engine.root,
                       '/db/seeds.d/75_job_templates.rb')
        ::JobInvocationComposer.any_instance.expects(:trigger!).returns(true)
        targets = @host1.id
        post :play_roles, :params => { :id => targets }
        response = JSON.parse(@response.body)
        assert_job_invocation_is_ok(response, targets)
      end

      test 'should trigger two host tasks' do
        load File.join(ForemanAnsible::Engine.root,
                       '/db/seeds.d/75_job_templates.rb')
        ::JobInvocationComposer.any_instance.expects(:trigger!).returns(true)
        targets = [@host1.id, @host2.id]

        post :multiple_play_roles, :params => { :id => targets }
        response = JSON.parse(@response.body)
        assert_job_invocation_is_ok(response, targets)
      end
    end
  end
end
