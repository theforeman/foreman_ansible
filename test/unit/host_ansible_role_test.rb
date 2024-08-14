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

  describe 'auditing' do
    setup do
      @host = FactoryBot.create(:host)
      @ansible_role = FactoryBot.create(:ansible_role)
      @host_ansible_role = FactoryBot.create(:host_ansible_role, :with_auditing, host_id: @host.id, ansible_role_id: @ansible_role.id)
      @audits = @host_ansible_role.audits
    end

    test 'should audit creation of a host ansible role' do
      assert_equal 1, @audits.size
      assert_associated_ids
      assert_equal 'create', @audits.last.action
    end

    test 'should audit deletion of a host ansible role' do
      @audits.clear
      @host_ansible_role.destroy

      assert_equal 1, @audits.size
      assert_associated_ids
      assert_equal 'destroy', @audits.last.action
    end

    def assert_associated_ids
      audit = @audits.last
      assert_equal @ansible_role.id, audit.audited_changes['ansible_role_id']
      assert_equal @host.id, audit.audited_changes['host_id']
    end
  end
end
