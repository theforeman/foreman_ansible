# frozen_string_literal: true

module ForemanAnsible
  class ImportRolesAndVariablesSuccessNotification < ::UINotifications::Base
    private

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
      name = 'Sync_roles_and_variables_successfully'
      @blueprint ||= NotificationBlueprint.unscoped.find_by(:name => name)
    end

    def message
      blueprint.message
    end
  end
end
