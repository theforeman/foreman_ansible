FactoryGirl.define do
  factory :ansible_role, :class => ForemanAnsible::AnsibleRole do
    sequence(:name) { |n| "ansible_role_#{n}" }
  end
end
