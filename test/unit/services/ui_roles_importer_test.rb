# frozen_string_literal: true

require 'test_plugin_helper'
# unit tests for UIRolesImporter
class UIRolesImporterTest < ActiveSupport::TestCase
  setup do
    changed_roles
    @importer = ForemanAnsible::UIRolesImporter.new
  end

  test 'should create new role' do
    refute AnsibleRole.find_by(:name => @new_role[:name])
    @importer.create_new_roles(@changes['new'])
    assert AnsibleRole.find_by(:name => @new_role[:name])
  end

  test 'should delete old roles' do
    assert AnsibleRole.find_by(:name => @role.name)
    @importer.delete_old_roles(@changes['obsolete'])
    refute AnsibleRole.find_by(:name => @role.name)
  end

  private

  def changed_roles
    @role = FactoryBot.create(:ansible_role)
    new_role_name = 'test_role.foreman'
    @new_role = { :id => nil, :name => new_role_name }
    @changes = { 'new' => { 'test_role.foreman' => @new_role },
                 'obsolete' => { @role.name => @role } }
  end
end
