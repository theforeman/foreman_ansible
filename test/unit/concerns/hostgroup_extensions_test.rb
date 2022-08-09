# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for the behavior of Hostgroup with roles, checks inheritance, etc
class HostgroupExtensionsTest < ActiveSupport::TestCase
  before do
    @role1 = FactoryBot.create(:ansible_role)
    @role2 = FactoryBot.create(:ansible_role)
    @role3 = FactoryBot.create(:ansible_role)

    @hostgroup_parent = FactoryBot.create(:hostgroup)
    FactoryBot.create(:hostgroup_ansible_role, :hostgroup_id => @hostgroup_parent.id, :ansible_role_id => @role2.id, :position => 1)
    @hostgroup = FactoryBot.create(:hostgroup)
    FactoryBot.create(:hostgroup_ansible_role, :hostgroup_id => @hostgroup.id, :ansible_role_id => @role1.id, :position => 10)
    @host = FactoryBot.create(:host, :hostgroup => @hostgroup)
    FactoryBot.create(:host_ansible_role, :host_id => @host.id, :ansible_role_id => @role3.id)
  end

  describe '#all_ansible_roles' do
    test 'returns assigned roles without any parent hostgroup' do
      @hostgroup.host_ansible_roles
      @hostgroup.all_ansible_roles.must_equal [@role1, @role3]
    end

    test 'returns assigned and inherited roles with from parent hostgroup' do
      @hostgroup.parent = @hostgroup_parent
      @hostgroup.all_ansible_roles.must_equal [@role2, @role1, @role3]
    end
  end

  describe '#inherited_ansible_roles' do
    test 'returns empty array for hostgroup without any parent' do
      @hostgroup.inherited_ansible_roles.must_equal []
    end

    test 'returns roles inherited from a chain of parents' do
      @hostgroup.parent = @hostgroup_parent
      @hostgroup.inherited_ansible_roles.must_equal [@role2]
    end
  end

  describe '#inherited_and_own_ansible_roles' do
    test 'returns only hostgroup roles' do
      @hostgroup_parent.inherited_and_own_ansible_roles.must_equal [@role2]
    end

    test 'returns only hostgroup roles including inheritance' do
      @hostgroup.parent = @hostgroup_parent
      @hostgroup.inherited_and_own_ansible_roles.must_equal [@role2, @role1]
    end
  end

  test 'should return ordered roles for hostgroup' do
    @hostgroup.parent = @hostgroup_parent
    @hostgroup.inherited_and_own_ansible_roles.must_equal [@role2, @role1]
  end

  describe '#cloned_ansibe_roles' do
    test 'clone ansible roles from hostgroup parent' do
      @hostgroup_parent.clone.all_ansible_roles.must_equal @hostgroup_parent.all_ansible_roles
    end
  end

  test 'should find hostgroup with role' do
    result = ::Hostgroup.search_for("ansible_role = #{@role1.name}").pluck(:id)
    assert_include result, @hostgroup.id
  end
end
