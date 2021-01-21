# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for validators and such of the join model between Host and
# AnsibleRole
class HostAnsibleRoleTest < ActiveSupport::TestCase
  should belong_to(:host)
  should belong_to(:ansible_role)
  should validate_presence_of(:ansible_role_id)

  describe 'uniqueness' do
    subject do
      HostAnsibleRole.new(:host => FactoryBot.build(:host),
                          :ansible_role => FactoryBot.build(:ansible_role),
                          :position => 0)
    end
    should validate_uniqueness_of(:ansible_role_id).scoped_to(:host_id)
  end
end
