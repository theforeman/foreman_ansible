module ForemanAnsible
  module Api
    module V2
      # Extends the hosts controller to support playing ansible roles
      module HostsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        # rubocop:disable BlockLength
        included do
          api :POST, '/hosts/:id/play_roles', N_('Plays Ansible roles on hosts')
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

          api :POST, '/hosts/:id/play_ad_hoc_role',
              N_('Plays an Ansible role ad hoc')
          param :id, String, :required => true
          param :the_role_id, String, :required => true

          def play_ad_hoc_role
            # FIXME: When using just role_id, find resource will throw an
            # exception: "undefined method `name' for nil:NilClass"
            find_ansible_role(params.require(:the_role_id))
            @result = {
              :host => @host, :role => @ansible_role,
              :foreman_tasks => async_task(
                ::Actions::ForemanAnsible::PlayHostRole, @host, @ansible_role
              )
            }

            render_message @result
          end
        end

        private

        def find_ansible_role(id)
          @ansible_role = AnsibleRole.find(id)
        end

        def action_permission
          case params[:action]
          when 'play_roles', 'multiple_play_roles', 'play_ad_hoc_role'
            :view
          else
            super
          end
        end
      end
    end
  end
end
