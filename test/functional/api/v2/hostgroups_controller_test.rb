# frozen_string_literal: true

require 'test_plugin_helper'
require 'ansible_role_assertions'
require 'dynflow/testing'

module Api
  module V2
    # Tests for the extra methods to play roles on Hostgroup
    class HostgroupsControllerTest < ActionController::TestCase
      include AnsibleRoleAssertions

      setup do
        @ansible_role1 = FactoryBot.create(:ansible_role)
        @ansible_role2 = FactoryBot.create(:ansible_role)
        @host1 = FactoryBot.create(:host, :with_hostgroup)
        @host2 = FactoryBot.create(:host, :with_hostgroup)
        @host3 = FactoryBot.create(:host, :with_hostgroup)
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

      test 'should list ansible roles for a host group' do
        FactoryBot.create(:hostgroup_ansible_role, hostgroup_id: @host3.hostgroup.id, ansible_role_id: @ansible_role1.id, position: 0)
        get :ansible_roles, :params => { :id => @host3.hostgroup.id }
        response = JSON.parse(@response.body)
        assert_equal @ansible_role1.id, response.first['id']
      end

      test 'should assign a role to a hostgroup with a correct ordering' do
        hostgroup = FactoryBot.create(:hostgroup,
                                      :ansible_role_ids => [])
        post :assign_ansible_roles,
             :params => {
               :id => hostgroup.id,
               :ansible_role_ids => [@ansible_role2.id, @ansible_role1.id]
             },
             :session => set_session_user
        assert_response :success
        assert_equal assigns('hostgroup').ansible_roles, [@ansible_role2, @ansible_role1]
      end

      test 'should append a role to a hostgroup with a correct ordering' do
        hostgroup = FactoryBot.create(:hostgroup,
                                      :ansible_role_ids => [@ansible_role1.id])
        post :add_ansible_role,
             :params => {
               :id => hostgroup.id,
               :ansible_role_id => [@ansible_role2.id]
             },
             :session => set_session_user
        assert_response 201
        assert_equal assigns('hostgroup').ansible_roles, [@ansible_role1, @ansible_role2]
      end

      test 'should remove only specified roles from a hostgroup' do
        hostgroup = FactoryBot.create(:hostgroup,
                                      :ansible_role_ids => [@ansible_role2.id, @ansible_role1.id])
        delete :remove_ansible_role,
               :params => {
                 :id => hostgroup.id,
                 :ansible_role_id => [@ansible_role2.id]
               },
               :session => set_session_user
        assert_response :success
        assert_equal assigns('hostgroup').ansible_roles, [@ansible_role1]
      end

      # Migrated from Robottelo TestAnsibleCfgMgmt::test_add_and_remove_ansible_role_hostgroup
      test 'should preserve nested role inheritance through assignment and removal' do
        role3 = FactoryBot.create(:ansible_role)
        role4 = FactoryBot.create(:ansible_role)
        host_role = FactoryBot.create(:ansible_role)
        parent_hg = FactoryBot.create(:hostgroup)
        child_hg = FactoryBot.create(:hostgroup, :parent => parent_hg)
        FactoryBot.create(:host, :managed => false, :hostgroup => child_hg, :ansible_roles => [host_role])

        post :assign_ansible_roles,
             :params => { :id => parent_hg.id, :ansible_role_ids => [@ansible_role1.id, @ansible_role2.id, role3.id] },
             :session => set_session_user
        assert_response :success
        get :ansible_roles, :params => { :id => parent_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [@ansible_role1, @ansible_role2, role3], :inherited => []

        put :add_ansible_role,
            :params => { :id => child_hg.id, :ansible_role_id => role4.id },
            :session => set_session_user
        assert_response :ok
        get :ansible_roles, :params => { :id => child_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [role4], :inherited => [@ansible_role1, @ansible_role2, role3]
        get :ansible_roles, :params => { :id => parent_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [@ansible_role1, @ansible_role2, role3], :inherited => []

        delete :remove_ansible_role,
               :params => { :id => parent_hg.id, :ansible_role_id => @ansible_role1.id },
               :session => set_session_user
        assert_response :success
        get :ansible_roles, :params => { :id => parent_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [@ansible_role2, role3], :inherited => []
        get :ansible_roles, :params => { :id => child_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [role4], :inherited => [@ansible_role2, role3]

        put :add_ansible_role,
            :params => { :id => child_hg.id, :ansible_role_id => @ansible_role2.id },
            :session => set_session_user
        assert_response :ok
        get :ansible_roles, :params => { :id => child_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [role4, @ansible_role2], :inherited => [@ansible_role2, role3]

        delete :remove_ansible_role,
               :params => { :id => child_hg.id, :ansible_role_id => @ansible_role2.id },
               :session => set_session_user
        assert_response :success
        get :ansible_roles, :params => { :id => child_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [role4], :inherited => [@ansible_role2, role3]

        post :assign_ansible_roles,
             :params => { :id => parent_hg.id, :ansible_role_ids => [] },
             :session => set_session_user
        assert_response :success
        get :ansible_roles, :params => { :id => parent_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [], :inherited => []
        get :ansible_roles, :params => { :id => child_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [role4], :inherited => []

        delete :remove_ansible_role,
               :params => { :id => child_hg.id, :ansible_role_id => role4.id },
               :session => set_session_user
        assert_response :success
        get :ansible_roles, :params => { :id => child_hg.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [], :inherited => []
      end
    end
  end
end
