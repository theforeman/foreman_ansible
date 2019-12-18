# frozen_string_literal: true

module ForemanAnsible
  # A class that builds custom notificaton for REX job if it's insights
  # remediation feature
  class InsightsNotificationBuilder < ::UINotifications::RemoteExecutionJobs::BaseJobFinish
    def deliver!
      ::Notification.create!(
        :audience => Notification::AUDIENCE_USER,
        :notification_blueprint => blueprint,
        :initiator => initiator,
        :message => message,
        :subject => subject,
        :actions => {
          :links => links
        }
      )
    end

    def blueprint
      name = 'insights_remediation_successful'
      @blueprint ||= NotificationBlueprint.unscoped.find_by(:name => name)
    end

    def hosts_count
      @hosts_count ||= subject.template_invocations_hosts.size
    end

    def message
      UINotifications::StringParser.new(blueprint.message,
                                        :hosts_count => hosts_count)
    end

    def links
      job_links + insights_links
    end

    def insights_links
      pattern_template = subject.pattern_template_invocations.first
      plan_id = pattern_template.input_values.
                joins(:template_input).
                where('template_inputs.name' => 'plan_id').
                first.try(:value)
      return [] if plan_id.nil?

      [
        {
          :href => "/redhat_access/insights/planner/#{plan_id}",
          :title => _('Remediation Plan')
        }
      ]
    end

    def job_links
      UINotifications::URLResolver.new(
        subject,
        :links => [{
          :path_method => :job_invocation_path,
          :title => _('Job Details')
        }]
      ).actions[:links]
    end
  end
end
