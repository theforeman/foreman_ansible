# frozen_string_literal: true

module ForemanAnsible
  class ImportPlaybooksErrorNotification < ::UINotifications::Base
    private

    def initialize(error, task)
      @job_error = error
      @subject = task
    end

    def create
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
      name = 'Sync_playbooks_failed'
      @blueprint ||= NotificationBlueprint.unscoped.find_by(:name => name)
    end

    def message
      _("Failed to import playbooks Due to: #{@job_error}")
    end

    def links
      [{ :href => Rails.application.routes.url_helpers.foreman_tasks_task_path(:id => subject.id), :title => N_('Task Details') }]
    end
  end
end
