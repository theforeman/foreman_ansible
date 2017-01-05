module Api
  module V2
    # Extends the hosts controller to support playing ansible roles
    module HostsControllerExtensions
      include ForemanTasks::Triggers

      # TODO: How to add this to API v2 controller?
      # api :POST, '/hosts/:id/play_roles', N_('Plays Ansible roles on hosts')
      # param :id, String, :required => true

      def play_roles
        @result = {
          :host => @host, :foreman_tasks => async_task(
            ::Actions::ForemanAnsible::PlayHostRoles, @host
          )
        }

        render_message @result
      end

      # TODO: How to add this to API v2 controller?
      # api :POST, '/hosts/play_roles', N_('Plays Ansible roles on hosts')
      # param :id, Array, :required => true

      def multiple_play_roles
        # TODO: How to prevent that find_resource is triggered by hosts_controller?
        @result = []

        @host.each do |item|
          @result.append(
            :host => item, :foreman_tasks => async_task(
              ::Actions::ForemanAnsible::PlayHostRoles, item
            )
          )
        end

        render_message @result
      end

      private

      def action_permission
        case params[:action]
        when 'play_roles', 'multiple_play_roles'
          :view
        else
          super
        end
      end
    end
  end
end
