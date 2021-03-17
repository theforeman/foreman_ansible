# frozen_string_literal: true

require 'test_plugin_helper'
# unit tests for ApiRolesImporter
class ApiRolesImporterTest < ActiveSupport::TestCase
  setup do
    @importer = ForemanAnsible::ApiRolesImporter.new
    first_name = 'test_user.test_name'
    second_name = 'some_user.some_role'
    @test_roles = [AnsibleRole.new(:name => first_name),
                   AnsibleRole.new(:name => second_name)]
  end

  test 'should import roles' do
    @importer.stubs(:prepare_ansible_import_rows).returns(
      [{
        :name => 'test_user.test_name',
        :id => nil,
        :role_action => 'Import Role',
        :variables => 'Add: 7',
        :hosts_count => '',
        :hostgroup_count => '',
        :kind => 'new'
      },
       {
         :name => 'some_user.some_role',
         :id => nil,
         :role_action => 'Import Role',
         :variables => 'Add: 3',
         :hosts_count => '',
         :hostgroup_count => '',
         :kind => 'new'
       }]
    )
    res = @importer.import!([@test_roles.first.name, @test_roles.last.name])
    assert_equal 2, res['changed']['new'].count
  end

  test 'should obsolete roles' do
    @importer.stubs(:import_role_names).returns(:obsolete => @test_roles)
    @test_roles.map(&:save)
    res = @importer.obsolete!
    assert_equal 2, res.count
    refute AnsibleRole.find_by :name => @test_roles.first.name
    refute AnsibleRole.find_by :name => @test_roles.last.name
  end
end
