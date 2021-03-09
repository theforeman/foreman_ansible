# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for testing the ignore list
class IgnoreRolesTest < ActiveSupport::TestCase
  include ForemanAnsible::AnsibleRolesDataPreparations

  role1 = AnsibleRole.new(:name => 'foo')
  role2 = AnsibleRole.new(:name => 'bar')
  role3 = AnsibleRole.new(:name => 'hello.txt')
  role4 = AnsibleRole.new(:name => 'hello.yml')
  role5 = AnsibleRole.new(:name => 'foo.yml')

  describe 'It should Ignore Role' do
    test 'If role starts with h' do
      Setting.stubs(:[]).with(:ansible_roles_to_ignore).returns(['h*'])
      assert_not role_match_excluded_roles(role1.name)
      assert_not role_match_excluded_roles(role2.name)
      assert role_match_excluded_roles(role3.name)
      assert role_match_excluded_roles(role4.name)
      assert_not role_match_excluded_roles(role5.name)
    end

    test 'If role ends with .yml' do
      Setting.stubs(:[]).with(:ansible_roles_to_ignore).returns(['*.yml'])
      assert_not role_match_excluded_roles(role1.name)
      assert_not role_match_excluded_roles(role2.name)
      assert_not role_match_excluded_roles(role3.name)
      assert role_match_excluded_roles(role4.name)
      assert role_match_excluded_roles(role5.name)
    end

    test 'If role have o char in the middle' do
      Setting.stubs(:[]).with(:ansible_roles_to_ignore).returns(['*o*'])
      assert role_match_excluded_roles(role1.name)
      assert_not role_match_excluded_roles(role2.name)
      assert role_match_excluded_roles(role3.name)
      assert role_match_excluded_roles(role4.name)
      assert role_match_excluded_roles(role5.name)
    end
  end
end
