# frozen_string_literal: false

require 'test_plugin_helper'

# Tests for the behavior of Host with roles, checks inheritance, etc
class HostManagedExtensionsTest < ActiveSupport::TestCase
  before do
    @role1 = FactoryBot.create(:ansible_role)
    @role2 = FactoryBot.create(:ansible_role)
    @role3 = FactoryBot.create(:ansible_role)

    @hostgroup_parent = FactoryBot.create(:hostgroup,
                                          :ansible_roles => [@role2])
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
      @host.all_ansible_roles.must_equal [@role1, @role2]
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
end
