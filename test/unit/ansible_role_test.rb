require 'test_plugin_helper'

# Tests for the behavior of Ansible Role, currently only validations
class AnsibleRoleTest < ActiveSupport::TestCase
  setup do
    @role = FactoryGirl.create(:ansible_role)
  end

  should have_many(:host_ansible_roles)
  should have_many(:hosts).through(:host_ansible_roles).dependent(:destroy)
  should validate_presence_of(:name)
  context 'with new role' do
    subject { AnsibleRole.new(:name => 'foo') }
    should validate_uniqueness_of(:name)
  end
end
