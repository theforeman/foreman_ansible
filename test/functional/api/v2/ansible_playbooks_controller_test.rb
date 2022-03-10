# frozen_string_literal: true

require 'test_plugin_helper'

module Api
  module V2
    # Tests for the ansible playbooks controller
    class AnsiblePlaybooksControllerTest < ActionController::TestCase
      let(:ansible_proxy) { FactoryBot.create(:smart_proxy, :with_ansible) }
      let(:proxy_api) { ::ProxyAPI::Ansible.new(url: ansible_proxy.url) }
      let(:playbooks_names) { %w[xprazak2.forklift_collection.foreman_provisioning.yml xprazak2.forklift_collection.collect_debug_draft.yml] }
      let(:importer_test) { mock('PlaybooksImporter') }

      test 'should fetch with nil' do
        AnsiblePlaybooksController.any_instance.stubs(:fetch_playbooks_names).returns(nil)

        get :fetch, :params => {
          :proxy_id => ansible_proxy.id
        }, :session => set_session_user
        response = JSON.parse(@response.body)
        assert_empty response['results']['playbooks_names']
        assert_response :success
      end

      test 'should fetch playbooks names' do
        AnsiblePlaybooksController.any_instance.stubs(:fetch_playbooks_names).returns(playbooks_names)

        get :fetch, :params => {
          :proxy_id => ansible_proxy.id
        }, :session => set_session_user
        response = JSON.parse(@response.body)
        assert_not_empty response['results']
        assert_equal response['results']['playbooks_names'], playbooks_names
      end

      test 'should use correct proxy' do
        AnsiblePlaybooksController.any_instance.expects(:find_proxy_api).with(ansible_proxy).returns(proxy_api)
        proxy_api.expects(:playbooks_names).returns(playbooks_names)

        get :fetch, :params => {
          :proxy_id => ansible_proxy.id
        }, :session => set_session_user
        response = JSON.parse(@response.body)
        assert_not_empty response['results']
        assert_not_empty playbooks_names = response['results']['playbooks_names']
        assert_equal 2, playbooks_names.count
      end

      test 'check plan and sync' do
        task = mock('Foreman Task')
        AnsiblePlaybooksController.any_instance.expects(:plan_ansible_sync).with(ansible_proxy.id, playbooks_names).returns(task)
        task.stubs(:id).returns('123')
        task.stubs(:action).returns('Import Playbooks')

        put :sync, :params => {
          :proxy_id => ansible_proxy.id,
          :playbooks_names => playbooks_names
        }, :session => set_session_user
        response = JSON.parse(@response.body)
        assert_equal '123', response['id']
        assert_equal 'Import Playbooks', response['action']
      end
    end
  end
end
