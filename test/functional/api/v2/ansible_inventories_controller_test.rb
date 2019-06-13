require 'test_plugin_helper'

module Api
  module V2
    class AnsibleInventoriesControllerTest < ActionController::TestCase
      setup do
        @hostgroup = FactoryBot.create(:hostgroup)
        @host1 = FactoryBot.create(:host, :hostgroup_id => @hostgroup.id)
        @host2 = FactoryBot.create(:host, :hostgroup_id => @hostgroup.id)
        @host3 = FactoryBot.create(:host)
      end

      test 'should show inventory for hosts by GET' do
        hosts = [@host1, @host3]
        get :hosts, :params => { :host_ids => hosts.pluck(:id) }, :session => set_session_user
        hosts_inventory_assertions(hosts)
      end

      test 'should show inventory for hosts by POST' do
        hosts = [@host1, @host3]
        post :hosts, :params => { :host_ids => hosts.pluck(:id) }, :session => set_session_user
        hosts_inventory_assertions(hosts)
      end

      test 'should show inventory for hostgroup by GET' do
        get :hostgroups, :params => { :hostgroup_ids => [@hostgroup.id] }, :session => set_session_user
        hosts_inventory_assertions(@hostgroup.hosts)
      end

      test 'should show inventory for hostgroup by POST' do
        get :hostgroups, :params => { :hostgroup_ids => [@hostgroup.id] }, :session => set_session_user
        hosts_inventory_assertions(@hostgroup.hosts)
      end

      private

      def hosts_inventory_assertions(hosts)
        response = JSON.parse(@response.body)
        all_hosts = response['all']['hosts']
        hosts.each do |host|
          assert all_hosts.include?(host.name)
        end
        hostvars = response["_meta"]["hostvars"]
        hosts.each do |host|
          assert hostvars[host.name]
        end
        assert_equal hosts.count, hostvars.keys.count
      end
    end
  end
end
