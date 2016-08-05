require 'test_plugin_helper'

module ForemanAnsible
  module Helpers
    class AnsibleRolesHelperTest < ActiveSupport::TestCase
      include ForemanAnsible::AnsibleRolesHelper

      before do
        @role1 = FactoryGirl.create(:ansible_role)
        @role2 = FactoryGirl.create(:ansible_role)
        @roles = [ @role1, @role2 ]
      end

      describe '#ansible_roles' do
        test 'it imports roles' do
          ForemanAnsible::RolesImporter.expects(:import!)
          ansible_roles
        end

        test 'returns all roles' do
          ForemanAnsible::RolesImporter.stubs(:import!)
          ansible_roles.must_equal @roles
        end
      end

      describe '#available_ansible_roles' do
        before do
          @hostgroup_parent = FactoryGirl.create(:hostgroup)
          @hostgroup = FactoryGirl.create(:hostgroup, :parent => @hostgroup_parent)
          @host = FactoryGirl.build_stubbed(:host, :hostgroup => @hostgroup)
          ForemanAnsible::RolesImporter.stubs(:import!)
        end

        test 'it imports roles' do
          ForemanAnsible::RolesImporter.expects(:import!)
          available_ansible_roles(@host)
        end

        test 'returns all roles for a host without any roles in a hostgroup' do
          available_ansible_roles(@host).must_equal @roles
        end

        test 'returns roles complementary to inherited ones for a host' do
          @hostgroup.ansible_roles << @roles.first
          available_ansible_roles(@host).must_equal [@role2]
        end

        test 'returns all roles for a hostgroup without any roles in a parent hostgroup' do
          available_ansible_roles(@hostgroup).must_equal @roles
        end

        test 'returns roles complementary to inherited ones for a hostgroup' do
          @hostgroup_parent.ansible_roles << @roles.first
          available_ansible_roles(@hostgroup).must_equal [@role2]
        end
      end
    end
  end
end
