module ForemanAnsible
  module Api
    module V2
      # Extends the hosts controller to support playing ansible roles
      module HostsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers

        included do
          api :POST, '/hosts/:id/play_roles',
              N_('Plays Ansible roles on a host')
          param :id, String, :required => true

          def play_roles
            @result = {
              :host => @host, :foreman_tasks => async_task(
                ::Actions::ForemanAnsible::PlayHostRoles, @host
              )
            }

            render_message @result
          end

          api :POST, '/hosts/play_roles', N_('Plays Ansible roles on hosts')
          param :id, Array, :required => true

          def multiple_play_roles
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
end
