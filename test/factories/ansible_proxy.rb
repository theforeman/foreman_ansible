# frozen_string_literal: true

FactoryBot.modify do
  factory :feature do
    trait :ansible do
      name { 'Ansible' }
    end

    factory :ansible_feature, traits: [:ansible]
  end

  factory :smart_proxy_feature do
    trait :ansible do
      association :feature, :ansible
    end
  end

  factory :smart_proxy do
    trait :with_ansible do
      features { [FactoryBot.create(:feature, :ansible)] }
    end
    trait :ansible do
      before(:create, :build, :build_stubbed) do
        ProxyAPI::V2::Features.any_instance.stubs(:features).returns(:ansible => { 'state' => 'running' })
      end
      after(:build) do |smart_proxy, _evaluator|
        smart_proxy.smart_proxy_features << FactoryBot.build(:smart_proxy_feature, :ansible, smart_proxy: smart_proxy)
      end
    end
  end
end
