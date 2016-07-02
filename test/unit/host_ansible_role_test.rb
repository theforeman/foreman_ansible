require 'test_plugin_helper'

class HostAnsibleRoleTest < ActiveSupport::TestCase
  should belong_to(:host)
  should belong_to(:ansible_role)
  should validate_presence_of(:ansible_role_id)
end
