# frozen_string_literal: true

require 'test_plugin_helper'

class AnsibleRolesHelperTest < ActiveSupport::TestCase
  include ForemanAnsible::AnsibleRolesHelper

  describe '#role_attributes_for_roles_switcher' do
    let(:hg_with_roles) { FactoryBot.create(:hostgroup, :with_ansible_roles) }

    context 'with hostgroup' do
      let(:child) { FactoryBot.build(:hostgroup, :with_ansible_roles, parent: hg_with_roles) }

      it 'show inherited and positioned own roles' do
        role_attributes = role_attributes_for_roles_switcher(child)
        expected_ids = hg_with_roles.ansible_roles.pluck(:id) + child.hostgroup_ansible_roles.map(&:ansible_role_id)
        assert_equal(expected_ids, role_attributes.map { |ra| ra[:id] })
      end

      it 'includes inherited roles just once' do
        child.host_ansible_roles << FactoryBot.build(:hostgroup_ansible_role, hostgroup: child, ansible_role: hg_with_roles.ansible_roles.first)
        role_attributes = role_attributes_for_roles_switcher(child)
        expected_ids = hg_with_roles.ansible_roles.pluck(:id) + child.hostgroup_ansible_roles.map(&:ansible_role_id)
        assert_equal(expected_ids.uniq, role_attributes.map { |ra| ra[:id] })
      end
    end

    context 'with host' do
      let(:host_new) { FactoryBot.build(:host, :with_ansible_roles, hostgroup: hg_with_roles) }

      it 'show inherited and positioned own roles' do
        role_attributes = role_attributes_for_roles_switcher(host_new)
        expected_ids = hg_with_roles.ansible_roles.pluck(:id) + host_new.host_ansible_roles.map(&:ansible_role_id)
        assert_equal(expected_ids, role_attributes.map { |ra| ra[:id] })
      end

      it 'includes inherited roles just once' do
        host_new.host_ansible_roles << FactoryBot.build(:host_ansible_role, host: host_new, ansible_role: hg_with_roles.ansible_roles.first)
        role_attributes = role_attributes_for_roles_switcher(host_new)
        expected_ids = hg_with_roles.ansible_roles.pluck(:id) + host_new.host_ansible_roles.map(&:ansible_role_id)
        assert_equal(expected_ids.uniq, role_attributes.map { |ra| ra[:id] })
      end
    end
  end
end
