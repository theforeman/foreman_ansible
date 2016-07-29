FactoryGirl.define do
  factory :ansible_role do
    sequence(:name) { |n| "ansible_role_#{n}" }
  end
end
