# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for validators and such of the join model between Hostgroup and
# AnsibleRole
class HostgroupAnsibleRoleTest < ActiveSupport::TestCase
  should belong_to(:hostgroup)
  should belong_to(:ansible_role)
  should validate_presence_of(:ansible_role_id)

  describe 'uniqueness' do
    subject do
      HostgroupAnsibleRole.new(
        :hostgroup => FactoryBot.build(:hostgroup),
        :ansible_role => FactoryBot.build(:ansible_role),
        :position => 0
      )
    end
    should validate_uniqueness_of(:ansible_role_id).scoped_to(:hostgroup_id)
  end

  describe 'ordering' do
    test 'should list roles in correct order' do
      hg = FactoryBot.create(:hostgroup)
      5.times do |idx|
        HostgroupAnsibleRole.create(:hostgroup => hg, :ansible_role => FactoryBot.create(:ansible_role), :position => idx)
      end

      hg.hostgroup_ansible_roles.each_with_index do |item, idx|
        assert_equal(item.position, idx + 1)
      end
    end
  end
end
