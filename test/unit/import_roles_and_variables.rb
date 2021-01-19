# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for testing the ignore list
class ImportRolesAndVariables < ActiveSupport::TestCase
  include ForemanAnsible::AnsibleRolesDataPreparations

  # existing Roles -> should be updated
  role1 = AnsibleRole.new(:name => 'ntp', :id => 10)
  role2 = AnsibleRole.new(:name => 'bar', :id => 11)

  # New Roles -> Should be imported
  role3 = AnsibleRole.new(:name => 'foo', :id => nil)
  role4 = AnsibleRole.new(:name => 'world', :id => nil)

  # Existing Role -> should be removed
  role5 = AnsibleRole.new(:name => 'h', :id => 12)

  # role1 variables -> add
  variable1 = AnsibleVariable.new(:key => 'ntp_statistics', :ansible_role_id => 10, :id => nil)
  variable2 = AnsibleVariable.new(:key => 'ntp_broadcast', :ansible_role_id  => 10, :id => nil)

  # role1 variables -> update
  variable3 = AnsibleVariable.new(:key => 'ntp_statistics', :ansible_role_id => 10, :id => 4)
  variable4 = AnsibleVariable.new(:key => 'ntp_crypto', :ansible_role_id => 10, :id => 5)

  # role1 variables -> obsolete
  variable5 = AnsibleVariable.new(:key => 'ntp_controlkey', :ansible_role_id => 10, :id => 6)
  variable6 = AnsibleVariable.new(:key => 'ntp_key', :ansible_role_id  => 10, :id => 7)

  # role2 variable -> Update
  variable7 = AnsibleVariable.new(:key => 'bar_key', :ansible_role_id  => 11, :id => 7, :override => false, :hidden_value => true)
  changed = { 'old' => [role1, role2], 'new' => [role3, role4], 'obsolete' => [role5] }
  old_roles_variables = { 'new' => [variable1, variable2], 'update' => [variable3, variable4, variable7], 'obsolete' => [variable5, variable6] }

  describe 'It should prepare the rows correctly' do
    setup do
      @variables_importer = mock('mock_variables_importer')
    end

    test 'prepare 5 rows' do
      expected = [{ :cells => [role1.name, 'Update Role Variables', 'Add: 2, Remove: 2, Update: 2', '', ''],
                    :role => role1, :kind => 'old', :id => role1.name },
                  { :cells => [role2.name, 'Update Role Variables', 'Update: 1', '', ''], :role => role2, :kind => 'old', :id => role2.name },
                  { :cells => [role3.name, 'Import Role', 'Add: 3', '', ''], :role => role3, :kind => 'new', :id => role3.name },
                  { :cells => [role4.name, 'Import Role', 'Add: 2', '', ''], :role => role4, :kind => 'new', :id => role4.name },
                  { :cells => [role5.name, 'Remove Role', '', 0, 0], :role => role5, :kind => 'obsolete', :id => role5.name }]
      # role3 and role4 importing new variables
      @variables_importer.expects(:get_variables_names).with(role3.name).returns({ 'a' => true, 'b' => false, 'c' => [] })
      @variables_importer.expects(:get_variables_names).with(role4.name).returns({ 'd' => true, 'e' => false })

      @variables_importer.expects(:import_variable_names).with([role3, role4]).returns(old_roles_variables)
      @variables_importer.expects(:import_variable_names).with([role1, role2]).returns(old_roles_variables)
      @variables_importer.expects(:import_variable_names).with([role5]).returns(old_roles_variables)
      result = prepare_ansible_import_rows(changed, @variables_importer)
      assert_equal result, expected
    end
  end
end
