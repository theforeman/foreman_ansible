# frozen_string_literal: true

require 'test_plugin_helper'
require 'ansible_role_assertions'

module Api
  module V2
    # Tests for the extra methods to play roles on a Host
    class HostsControllerTest < ActionController::TestCase
      include AnsibleRoleAssertions

      setup do
        @ansible_role1 = FactoryBot.create(:ansible_role)
        @ansible_role2 = FactoryBot.create(:ansible_role)
        @ansible_role3 = FactoryBot.create(:ansible_role)
        @host1 = FactoryBot.create(:host)
        @host2 = FactoryBot.create(:host)
        @host3 = FactoryBot.create(:host)
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

        post :multiple_play_roles, :params => { :host_ids => targets }
        response = JSON.parse(@response.body)
        assert_job_invocation_is_ok(response, targets)
      end

      test 'should create a host with ansible_role_ids param' do
        post :create,
             :params => { :host => { :ansible_role_ids => @ansible_role1.id,
                                     :managed => false,
                                     :name => 'Doe' } },
             :session => set_session_user
        assert_response :created
        assert assigns('host').ansible_roles, [@ansible_role1]
      end

      test 'should update a host with ansible_role_ids param' do
        host = FactoryBot.create(:host, :managed => false)
        FactoryBot.create(:host_ansible_role, :host_id => host.id, :ansible_role_id => @ansible_role1.id, :position => 0)

        post :update,
             :params => {
               :id => host.id,
               :host => { :ansible_role_ids => [@ansible_role2.id] }
             },
             :session => set_session_user
        assert_response :success
        host.reload
        assert_equal host.ansible_roles, [@ansible_role2]
      end

      test 'should list ansible roles for a host' do
        FactoryBot.create(:host_ansible_role, :host_id => @host3.id, :ansible_role_id => @ansible_role1.id, :position => 0)
        get :ansible_roles, :params => { :id => @host3.id }
        response = JSON.parse(@response.body)
        assert_equal @ansible_role1.id, response.first['id']
      end

      test 'should assign a role to a host with a correct ordering' do
        host = FactoryBot.create(:host,
                                 :managed => false,
                                 :ansible_role_ids => [])
        post :assign_ansible_roles,
             :params => {
               :id => host.id,
               :ansible_role_ids => [@ansible_role2.id, @ansible_role1.id]
             },
             :session => set_session_user
        assert_response :success
        assert_equal assigns('host').ansible_roles, [@ansible_role2, @ansible_role1]
      end

      test 'should append a role to a host with a correct ordering' do
        host = FactoryBot.create(:host,
                                 :managed => false,
                                 :ansible_role_ids => [@ansible_role3.id])
        post :add_ansible_role,
             :params => {
               :id => host.id,
               :ansible_role_id => @ansible_role2.id
             },
             :session => set_session_user
        assert_response 201
        assert_equal assigns('host').ansible_roles, [@ansible_role3, @ansible_role2]
      end

      test 'should remove only specified roles from a host' do
        host = FactoryBot.create(:host,
                                 :managed => false,
                                 :ansible_role_ids => [@ansible_role3.id, @ansible_role2.id, @ansible_role1.id])
        delete :remove_ansible_role,
               :params => {
                 :id => host.id,
                 :ansible_role_id => [@ansible_role2.id]
               },
               :session => set_session_user
        assert_response :success
        assert_equal assigns('host').ansible_roles, [@ansible_role3, @ansible_role1]
      end

      # Migrated from Robottelo TestAnsibleCfgMgmt::test_positive_ansible_roles_inherited_from_hostgroup
      test 'should update inherited role flags when moving a host between nested hostgroups' do
        parent_hg = FactoryBot.create(:hostgroup, :ansible_roles => [@ansible_role2])
        child_hg = FactoryBot.create(:hostgroup, :parent => parent_hg, :ansible_roles => [@ansible_role3])
        host = FactoryBot.create(:host, :managed => false, :ansible_roles => [@ansible_role1, @ansible_role3])

        get :ansible_roles, :params => { :id => host.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [@ansible_role1, @ansible_role3], :inherited => []

        put :update,
            :params => { :id => host.id, :host => { :hostgroup_id => child_hg.id } },
            :session => set_session_user
        assert_response :success
        assert_equal child_hg.id, host.reload.hostgroup_id
        get :ansible_roles, :params => { :id => host.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [@ansible_role1, @ansible_role3], :inherited => [@ansible_role2, @ansible_role3]

        put :update,
            :params => { :id => host.id, :host => { :hostgroup_id => parent_hg.id } },
            :session => set_session_user
        assert_response :success
        assert_equal parent_hg.id, host.reload.hostgroup_id
        get :ansible_roles, :params => { :id => host.id }
        assert_response :success
        assert_ansible_roles JSON.parse(response.body), :directly_assigned => [@ansible_role1, @ansible_role3], :inherited => [@ansible_role2]
      end
    end
  end
end
