module ForemanAnsible
  # Fetch information about a plan from RH Insights and run it
  class InsightsPlanRunner
    include RedhatAccess::Telemetry::LookUps

    def initialize(organization, plan_id)
      @organization = organization
      @plan_id = plan_id
    end

    def run_playbook
      rules = playbook
      hostname_rules_relation = hostname_rules(rules)
      hosts = hostname_rules_relation.keys.map do |hostname|
        Host::Managed.find_by(:name => hostname)
      end

      composer = JobInvocationComposer.for_feature(
        :ansible_run_insights_plan,
        hosts,
        :organization_id => @organization.id, :plan_id => @plan_id
      )
      composer.save
      composer.trigger
    end

    # Fetches the playbook from the Red Hat Insights API
    def playbook
      resource = RestClient::Resource.new(
        'https://api.access.redhat.com/r/insights/'\
        "v3/maintenance/#{@plan_id}/playbook",
        get_ssl_options_for_org(@organization, nil).
        merge(:verify_ssl => OpenSSL::SSL::VERIFY_NONE)
      )
      response = resource.get
      YAML.safe_load(response.body)
    end

    # This method creates a hash like this:
    #  {
    #    hostname1 => [rule1,rule2,rule3],
    #    hostname2 => [rule1,rule3],
    #  }
    #
    #  Rules are distinguished by name and saved without the 'hosts' field
    #  as it's irrelevant in the Foreman REX context ('hosts: all' is used
    #  so that all=job invocation targets)
    def rules_to_hash(rules)
      result = {}
      rules.map do |rule|
        rule['hosts'] = 'all'
        result[rule['name']] = rule
      end
      result
    end

    def hostname_rules(rules)
      result = Hash.new { |h, k| h[k] = [] }
      rules.each do |rule|
        rule['hosts'].split(',').each do |host|
          result[host] << rule['name']
        end
      end
      result
    end
  end
end
