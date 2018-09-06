require 'test_plugin_helper'

# Tests for the behavior of Ansible Variable, currently only validations
class AnsibleVariableTest < ActiveSupport::TestCase
  should belong_to(:ansible_role)
end
