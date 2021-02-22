FactoryBot.modify do
  factory :host do
    trait :with_ansible_roles do
      transient do
        roles_count { 2 }
      end
      after(:build) do |host, evaluator|
        host.host_ansible_roles = FactoryBot.build_list(:host_ansible_role, evaluator.roles_count, host: host)
      end
    end
  end

  factory :hostgroup do
    trait :with_ansible_roles do
      transient do
        roles_count { 2 }
      end
      after(:build) do |hostgroup, evaluator|
        hostgroup.hostgroup_ansible_roles = FactoryBot.build_list(:hostgroup_ansible_role, evaluator.roles_count, hostgroup: hostgroup)
      end
    end
  end
end
