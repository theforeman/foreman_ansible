require 'test_plugin_helper'

class HostgroupAnsibleRoleTest < ActiveSupport::TestCase
  should belong_to(:hostgroup)
  should belong_to(:ansible_role)
  should validate_presence_of(:ansible_role_id)

  describe 'uniqueness' do
    subject { HostgroupAnsibleRole.new(hostgroup: FactoryGirl.build(:hostgroup), ansible_role: FactoryGirl.build(:ansible_role)) }
    should validate_uniqueness_of(:ansible_role_id).scoped_to(:hostgroup_id)
  end
end
