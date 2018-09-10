# frozen_string_literal: true

module ForemanAnsible
  # Macro to fetch RH Insights plan playbook
  module RendererMethods
    extend ActiveSupport::Concern

    def insights_remediation(plan_id, organization_id = Organization.current.id)
      return "$INSIGHTS_REMEDIATION[#{plan_id}, #{organization_id}]" if preview?

      cached("insights_#{plan_id}_#{organization_id}") do
        Rails.logger.debug 'cache miss for insights plan fetching'
        insights_plan = ForemanAnsible::InsightsPlanRunner.new(
          Organization.find(organization_id),
          plan_id
        )
        rules = insights_plan.playbook
        disclaimer = insights_plan.parse_disclaimer
        hostname_rules_relation = insights_plan.hostname_rules(rules)
        global_rules = insights_plan.rules_to_hash(rules)
        host_playbooks = individual_host_playbooks(hostname_rules_relation,
                                                   global_rules)
        "#{disclaimer}\n#{host_playbooks.to_yaml}"
      end
    end

    private

    def individual_host_playbooks(hostname_rules_relation, global_rules)
      hostname_rules_relation[@host.name].reduce([]) do |acc, cur|
        acc << global_rules[cur]
      end
    end
  end
end
