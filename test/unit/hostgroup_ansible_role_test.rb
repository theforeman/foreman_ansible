require 'test_plugin_helper'

class HostgroupAnsibleRoleTest < ActiveSupport::TestCase
  should belong_to(:hostgroup)
  should belong_to(:ansible_role)
  should validate_presence_of(:ansible_role_id)
end
