# frozen_string_literal: true

require 'test_plugin_helper'
# Unit tests for importing variables
# This service is meant to take in essentially a string coming from
# the proxy API, and parse that into AnsibleVariables.
class AnsibleVariablesImporterTest < ActiveSupport::TestCase
  let(:importer) { ForemanAnsible::VariablesImporter.new }

  describe '#import_variables' do
    test 'does not reimport already existing variables' do
      already_existing = FactoryBot.create(:ansible_variable)
      new_role = FactoryBot.create(:ansible_role)
      api_response = {
        new_role.name => { 'new_var' => 'new value' },
        already_existing.ansible_role.name => { already_existing.key => already_existing.default_value }
      }
      changes = importer.import_variables(api_response, [new_role.name])
      assert_empty changes['update']
      assert_not_empty changes['new']
      assert_equal 'new_var', changes['new'].first.key
      assert_equal new_role, changes['new'].first.ansible_role
    end

    test "variables attempts to remove variables that don't exist anymore" do
      obsolete_variable = FactoryBot.create(:ansible_variable)
      changes = importer.import_variables({}, [])
      assert_not_empty changes['obsolete']
      assert_equal obsolete_variable.key, changes['obsolete'].first.key
      assert_equal(
        obsolete_variable.ansible_role,
        changes['obsolete'].first.ansible_role
      )
    end

    test 'does not do anything if response is empty' do
      changes = importer.import_variables({}, [])
      assert_equal({ 'new' => [], 'obsolete' => [], 'update' => [] }, changes)
    end

    test 'update changed defaults' do
      role = FactoryBot.create(:ansible_role)
      variable = FactoryBot.create(:ansible_variable, :default_value => 'default value', :ansible_role => role)
      api_response = {
        role.name => { variable.key => 'changed value' }
      }
      changes = importer.import_variables(api_response, [])
      assert_not_empty changes['update']
      assert_equal variable.key, changes['update'].first.key
    end

    test 'does not update overriden defaults' do
      role = FactoryBot.create(:ansible_role)
      variable = FactoryBot.create(:ansible_variable, :default_value => 'default value', :override => true, :ansible_role => role)
      api_response = {
        role.name => { variable.key => 'changed value' }
      }
      changes = importer.import_variables(api_response, [])
      assert_empty changes['update']
    end

    test 'reimports variable with same key for different role' do
      role = FactoryBot.create(:ansible_role)
      variable = FactoryBot.create(:ansible_variable)
      api_response = {
        role.name => { variable.key => 'new value' }
      }
      changes = importer.import_variables(api_response, [role.name])
      assert_empty changes['update']
      assert_not_empty changes['new']
      assert_equal variable.key, changes['new'].first.key
      assert_equal 'new value', changes['new'].first.default_value
    end

    test 'ignores custom variables' do
      FactoryBot.create(:ansible_variable, :imported => false)
      changes = importer.import_variables({}, [])
      assert_empty changes['obsolete']
    end
  end
end
