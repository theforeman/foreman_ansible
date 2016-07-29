require 'test_plugin_helper'
# unit tests for RolesImporter
class RolesImporterTest < ActiveSupport::TestCase
  setup do
    @role = FactoryGirl.create(:ansible_role)
    @importer = ForemanAnsible::RolesImporter.new
  end

  test 'should detect changes when importing roles' do
    role = FactoryGirl.build(:ansible_role)
    changes = @importer.detect_changes [role]
    assert_equal 1, changes[:new].length
    assert_equal 1, changes[:obsolete].length
    assert_equal role.name, changes[:new].first.name
    assert_equal @role.name, changes[:obsolete].first.name
  end

  test 'should create new role' do
    changed_roles
    refute AnsibleRole.find_by(:name => @new_role[:name])
    @importer.create_new_roles(@changes['new'])
    assert AnsibleRole.find_by(:name => @new_role[:name])
  end

  test 'should delete old roles' do
    changed_roles
    assert AnsibleRole.find_by(:name => @role.name)
    @importer.delete_old_roles(@changes['obsolete'])
    refute AnsibleRole.find_by(:name => @role.name)
  end

  private

  def changed_roles
    new_role_name = 'test_role.foreman'
    @new_role = { :id => nil, :name => new_role_name }
    @changes = { 'new' => { 'test_role.foreman' => @new_role.to_json },
                 'obsolete' => { @role.name => @role.to_json }
               }
  end
end
