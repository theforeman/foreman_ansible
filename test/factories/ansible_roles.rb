# frozen_string_literal: true

FactoryBot.define do
  factory :ansible_role do
    sequence(:name) { |n| "ansible_role_#{n}" }
  end

  factory :host_ansible_role do
    position { nil }
    host
    ansible_role
  end

  factory :hostgroup_ansible_role do
    position { nil }
    hostgroup
    ansible_role
  end
end
