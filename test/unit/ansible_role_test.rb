 require 'test_plugin_helper'

class AnsibleRoleTest < ActiveSupport::TestCase
  should have_many(:host_ansible_roles)
  should have_many(:hosts).through(:host_ansible_roles).dependent(:destroy)
  should validate_presence_of(:name)
  should validate_uniqueness_of(:name)
end
