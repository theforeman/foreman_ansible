module ForemanAnsible
  module Api
    module V2
      # Extends the hosts controller to support playing ansible roles
      module HostsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include Api::V2::Concerns::ApiCommon

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        # rubocop:disable BlockLength
        included do
          before_action :find_ansible_roles, :only => [:ansible_roles]

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

          api :GET, '/hosts/:id/list_ansible_roles',
              N_('Lists assigned Ansible roles')
          param :id, :identifier, :required => true

          def list_ansible_roles
            @result = {
              :all_ansible_roles => @host.all_ansible_roles,
              :ansible_roles => @host.ansible_roles,
              :inherited_ansible_roles => @host.inherited_ansible_roles
            }

            render_message @result
          end

          api :POST, '/hosts/:id/ansible_roles',
              N_('Assigns Ansible roles to a host')
          param :id, :identifier, :required => true
          param :roles, Array, :required => true

          def ansible_roles
            @host.ansible_roles = @roles

            @result = {
              :roles => @roles,
              :host => @host
            }

            render_message @result
          end
        end

        private

        def action_permission
          case params[:action]
          when 'play_roles', 'multiple_play_roles', 'ansible_roles',
               'list_ansible_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
