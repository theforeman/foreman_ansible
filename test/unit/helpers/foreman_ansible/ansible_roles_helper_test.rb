require 'test_plugin_helper'

module ForemanAnsible
  module Helpers
    # Tests for the helper that triggers the import automatically
    class AnsibleRolesHelperTest < ActiveSupport::TestCase
      include ForemanAnsible::AnsibleRolesHelper

      before do
        @role1 = FactoryGirl.create(:ansible_role)
        @role2 = FactoryGirl.create(:ansible_role)
        @roles = [@role1, @role2]
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
    end
  end
end
