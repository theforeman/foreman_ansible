# frozen_string_literal: true

FactoryBot.define do
  factory :ansible_variable do
    sequence(:key) { |n| "ansible_variable_#{n}" }
    ansible_role
  end
end
