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

      test 'applies view_hosts filters to host inventory' do
        setup_user('view', 'hosts', "hostgroup_id = #{@hostgroup.id}")

        get :hosts, :params => { :host_ids => [@host1.id, @host3.id] },
                    :session => set_session_user(@one)

        inventory = JSON.parse(@response.body)
        hostvars = inventory['_meta']['hostvars']
        assert_equal [@host1.name], inventory['all']['hosts']
        assert_not hostvars.key?(@host3.name)

        get :hosts, :params => { :host_ids => [@host3.id] },
                    :session => set_session_user(@one)

        inventory = JSON.parse(@response.body)
        assert_empty inventory['all']['hosts']
        assert_empty inventory['_meta']['hostvars']
      end

      test 'applies view_hosts filters to hostgroup inventory' do
        forbidden_hostgroup = FactoryBot.create(:hostgroup)
        forbidden_host = FactoryBot.create(:host, :hostgroup_id => forbidden_hostgroup.id)
        setup_user('view', 'hosts', "hostgroup_id = #{@hostgroup.id}")
        setup_user('view', 'hostgroups')

        get :hostgroups,
            :params => { :hostgroup_ids => [@hostgroup.id, forbidden_hostgroup.id] },
            :session => set_session_user(@one)

        hosts_inventory_assertions(@hostgroup.hosts)
        assert_not JSON.parse(@response.body)['_meta']['hostvars'].key?(forbidden_host.name)

        get :hostgroups, :params => { :hostgroup_ids => [forbidden_hostgroup.id] },
                         :session => set_session_user(@one)

        inventory = JSON.parse(@response.body)
        assert_empty inventory['all']['hosts']
        assert_empty inventory['_meta']['hostvars']
      end

      test 'should show inventory for hostgroup by GET' do
        get :hostgroups, :params => { :hostgroup_ids => [@hostgroup.id] }, :session => set_session_user
        hosts_inventory_assertions(@hostgroup.hosts)
      end

      test 'should show inventory for hostgroup by POST' do
        get :hostgroups, :params => { :hostgroup_ids => [@hostgroup.id] }, :session => set_session_user
        hosts_inventory_assertions(@hostgroup.hosts)
      end

      test 'schedule inventory by user' do
        report = FactoryBot.create(:report_template)
        Setting['ansible_inventory_template'] = report.name
        user = FactoryBot.create(:user)
        user.roles << Role.find_by(:name => 'Ansible Tower Inventory Reader')
        post :schedule, session: set_session_user(user)
        assert_response :success
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
