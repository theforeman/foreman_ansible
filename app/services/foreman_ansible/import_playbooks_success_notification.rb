# frozen_string_literal: true

module ForemanAnsible
  class ImportPlaybooksSuccessNotification < ::UINotifications::Base
    private

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
      name = 'Sync_playbooks_successfully'
      @blueprint ||= NotificationBlueprint.unscoped.find_by(:name => name)
    end

    def message
      blueprint.message
    end

    def links
      [{ :href => Rails.application.routes.url_helpers.foreman_tasks_task_path(:id => subject.id), :title => N_('Task Details') }]
    end
  end
end
