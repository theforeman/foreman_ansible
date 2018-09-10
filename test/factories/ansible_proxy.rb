# frozen_string_literal: true

FactoryBot.modify do
  factory :smart_proxy do
    trait :with_ansible do
      features { [::Feature.find_or_create_by(:name => 'Ansible')] }
    end
  end
end
