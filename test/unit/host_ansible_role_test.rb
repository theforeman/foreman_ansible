require 'test_plugin_helper'

class HostAnsibleRoleTest < ActiveSupport::TestCase
  should belong_to(:host)
  should belong_to(:ansible_role)
  should validate_presence_of(:ansible_role_id)

  describe 'uniqueness' do
    subject { HostAnsibleRole.new(host: FactoryGirl.build(:host), ansible_role: FactoryGirl.build(:ansible_role)) }
    should validate_uniqueness_of(:ansible_role_id).scoped_to(:host_id)
  end
end
