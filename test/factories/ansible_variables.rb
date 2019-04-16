# frozen_string_literal: true

FactoryBot.define do
  factory :ansible_variable do
    sequence(:key) { |n| "ansible_variable_#{n}" }
    sequence(:default_value) { |n| "default_value_#{n}" }
    ansible_role
    imported true
  end
end
