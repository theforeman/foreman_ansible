# frozen_string_literal: true

require 'test_plugin_helper'
# unit tests for RolesImporter
class RolesImporterTest < ActiveSupport::TestCase
  setup do
    @role = FactoryBot.create(:ansible_role)
    @importer = ForemanAnsible::RolesImporter.new
  end

  test 'should detect changes when importing roles' do
    role = FactoryBot.build(:ansible_role)
    changes = @importer.detect_changes [role]
    assert_equal 1, changes[:new].length
    assert_equal 1, changes[:obsolete].length
    assert_equal role.name, changes[:new].first.name
    assert_equal @role.name, changes[:obsolete].first.name
  end
end
