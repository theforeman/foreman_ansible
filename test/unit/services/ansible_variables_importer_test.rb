# frozen_string_literal: true

require 'test_plugin_helper'
# Unit tests for importing variables
# This service is meant to take in essentially a string coming from
# the proxy API, and parse that into AnsibleVariables.
class AnsibleVariablesImporterTest < ActiveSupport::TestCase
  setup do
    @importer = ForemanAnsible::VariablesImporter.new
  end
  test 'does not reimport already existing variables' do
    already_existing = FactoryBot.create(:ansible_variable)
    new_role = FactoryBot.create(:ansible_role)
    api_response = {
      new_role.name => { 'new_var' => 'new value' },
      already_existing.ansible_role.name => { already_existing.key => already_existing.default_value }
    }
    changes = @importer.import_variables(api_response, [new_role.name])
    assert_not_empty changes['new']
    assert_equal 'new_var', changes['new'].first.key
    assert_equal new_role, changes['new'].first.ansible_role
  end

  test "variables attempts to remove variables that don't exist anymore" do
    obsolete_variable = FactoryBot.create(:ansible_variable)
    changes = @importer.import_variables({}, [])
    assert_not_empty changes['obsolete']
    assert_equal obsolete_variable.key, changes['obsolete'].first.key
    assert_equal(
      obsolete_variable.ansible_role,
      changes['obsolete'].first.ansible_role
    )
  end

  test 'does not do anything if response is empty' do
    changes = @importer.import_variables({}, [])
    assert_equal({ 'new' => [], 'obsolete' => [], 'update' => [] }, changes)
  end

  test 'do not update changed defaults' do
    role = FactoryBot.create(:ansible_role)
    variable = FactoryBot.create(:ansible_variable, :default_value => 'default value', :ansible_role_id => role.id)
    api_response = {
      role.name => { variable.key => 'changed value', 'new_variable' => 'new value' }
    }
    changes = @importer.import_variables(api_response, [])
    assert_empty changes['update']
    assert_equal 'new_variable', changes['new'].first.key
  end

  test 'should ignore custom variables' do
    FactoryBot.create(:ansible_variable, :imported => false)
    changes = @importer.import_variables({}, [])
    assert_empty changes['obsolete']
  end
end
