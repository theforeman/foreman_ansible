require 'test_plugin_helper'

# Tests for the behavior of Hostgroup with roles, checks inheritance, etc
class HostgroupExtensionsTest < ActiveSupport::TestCase
  before do
    @role1 = FactoryBot.create(:ansible_role)
    @role2 = FactoryBot.create(:ansible_role)
    @role3 = FactoryBot.create(:ansible_role)

    @hostgroup_parent = FactoryBot.create(:hostgroup,
                                          :ansible_roles => [@role2])
    @hostgroup = FactoryBot.create(:hostgroup, :ansible_roles => [@role1])
  end

  describe '#all_ansible_roles' do
    test 'returns assigned roles without any parent hostgroup' do
      @hostgroup.all_ansible_roles.must_equal [@role1]
    end

    test 'returns assigned and inherited roles with a parent hostgroup' do
      @hostgroup.parent = @hostgroup_parent
      @hostgroup.all_ansible_roles.must_equal [@role1, @role2]
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
end
