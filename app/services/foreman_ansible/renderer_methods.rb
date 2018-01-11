module ForemanAnsible
  # Macro to fetch RH Insights plan playbook
  module RendererMethods
    extend ActiveSupport::Concern

    def insights_remediation(plan_id, organization_id = Organization.current.id)
      insights_plan = ForemanAnsible::InsightsPlanRunner.new(
        Organization.find(organization_id),
        plan_id
      )
      rules = insights_plan.playbook
      hostname_rules_relation = insights_plan.hostname_rules(rules)
      global_rules = insights_plan.rules_to_hash(rules)
      host_playbooks = hostname_rules_relation[@host.name].
                       reduce([]) do |acc, cur|
        acc << global_rules[cur]
      end
      host_playbooks.to_yaml
    end
  end
end
