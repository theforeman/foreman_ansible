# frozen_string_literal: true

module ForemanAnsible
  class ImportRolesAndVariablesErrorNotification < ::UINotifications::Base
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
        :subject => subject
      )
    end

    def blueprint
      name = 'Sync_roles_and_variables_failed'
      @blueprint ||= NotificationBlueprint.unscoped.find_by(:name => name)
    end

    def message
      _("Failed to import roles and variables Due to: #{@job_error}")
    end
  end
end
