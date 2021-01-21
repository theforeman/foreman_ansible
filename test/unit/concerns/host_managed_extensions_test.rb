# frozen_string_literal: false

require 'test_plugin_helper'

# Tests for the behavior of Host with roles, checks inheritance, etc
class HostManagedExtensionsTest < ActiveSupport::TestCase
  before do
    @role1 = FactoryBot.create(:ansible_role)
    @role2 = FactoryBot.create(:ansible_role)
    @role3 = FactoryBot.create(:ansible_role)

    @hostgroup_parent = FactoryBot.create(:hostgroup)
    FactoryBot.create(:hostgroup_ansible_role, hostgroup_id: @hostgroup_parent.id, ansible_role_id: @role2.id)
    @hostgroup = FactoryBot.create(:hostgroup, :parent => @hostgroup_parent)
    @host = FactoryBot.build_stubbed(:host, :ansible_roles => [@role1])
    @another_host = FactoryBot.build_stubbed(:host, :ansible_roles => [@role3])
  end

  describe '#all_ansible_roles' do
    test 'returns assigned roles for host without a hostgroup' do
      @host.all_ansible_roles.must_equal [@role1]
    end

    test 'returns assigned and inherited roles for host with a hostgroup' do
      @host.hostgroup = @hostgroup
      @host.all_ansible_roles.must_equal [@role2, @role1]
    end
  end

  describe '#inherited_ansible_roles' do
    test 'returns empty array for host without hostgroup' do
      @host.inherited_ansible_roles.must_equal []
    end

    test 'returns roles inherited from a hostgroup' do
      @host.hostgroup = @hostgroup
      @host.inherited_ansible_roles.must_equal [@role2]
    end
  end

  describe 'import facts' do
    test 'when hostname looks like an IP it finds the right host' do
      @host = ::FactoryBot.create(:host, :ip => '192.168.128.27')
      assert_equal @host, Host::Managed.import_host(@host.ip)
    end

    test 'when hostname looks like an IP but there is no host with that IP' do
      assert Host::Managed.import_host('192.168.128.27').new_record?
    end
  end

  test 'should correctly order roles for host' do
    host = FactoryBot.create(:host)
    FactoryBot.create(:host_ansible_role, :ansible_role_id => @role1.id, :position => 1, :host_id => host.id)
    FactoryBot.create(:host_ansible_role, :ansible_role_id => @role2.id, :position => 2, :host_id => host.id)
    FactoryBot.create(:host_ansible_role, :ansible_role_id => @role3.id, :position => 0, :host_id => host.id)
    host.ansible_roles.must_equal [@role3, @role1, @role2]
  end

  test 'should order hostgroup roles before host roles' do
    host = FactoryBot.create(:host, :hostgroup => @hostgroup)
    FactoryBot.create(:host_ansible_role, :ansible_role_id => @role1.id, :position => 0, :host_id => host.id)
    host.all_ansible_roles.must_equal [@role2, @role1]
  end
end
