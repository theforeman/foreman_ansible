require 'test_plugin_helper'
require 'dynflow/testing'

module Api
  module V2
    # Tests for the extra methods to play roles on Hostgroup
    class HostgroupsControllerTest < ActionController::TestCase
      setup do
        @host1 = FactoryBot.create(:host, :with_hostgroup)
        @host2 = FactoryBot.create(:host, :with_hostgroup)
        @ansible_role1 = FactoryBot.create(:ansible_role)
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

      test 'should assign a role to a hostgroup' do
        hostgroup = FactoryBot.create(:hostgroup,
                                      :ansible_role_ids => [])
        post :assign_ansible_roles,
             :params => {
               :id => hostgroup.id,
               :ansible_role_ids => [@ansible_role1.id]
             },
             :session => set_session_user
        assert_response :success
        assert assigns('hostgroup').ansible_roles, [@ansible_role1]
      end
    end
  end
end
