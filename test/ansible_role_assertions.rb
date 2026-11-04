# frozen_string_literal: true

# Assertions for the hosts and hostgroups Ansible role listing APIs.
module AnsibleRoleAssertions
  def assert_ansible_roles(roles, directly_assigned:, inherited:)
    expected = (directly_assigned + inherited).uniq.map do |role|
      [role.id, directly_assigned.include?(role), inherited.include?(role)]
    end
    actual = roles.map { |role| role.values_at('id', 'directly_assigned', 'inherited') }
    assert_equal expected, actual
  end
end
