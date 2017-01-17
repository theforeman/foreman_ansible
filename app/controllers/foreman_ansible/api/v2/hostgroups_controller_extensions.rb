module ForemanAnsible
  module Api
    module V2
      # Extends the hostgroups controller to support playing ansible roles
      module HostgroupsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        # rubocop:disable BlockLength
        included do
          api :POST, '/hostgroups/play_roles',
              N_('Plays Ansible roles on hostgroups')
          param :id, Array, :required => true

          def play_roles
            find_resource

            @result = {
              :hostgroup => @hostgroup, :foreman_tasks => async_task(
                ::Actions::ForemanAnsible::PlayHostgroupRoles, @hostgroup
              )
            }

            render_message @result
          end

          api :POST, '/hostgroups/play_roles',
              N_('Plays Ansible roles on hostgroups')
          param :id, Array, :required => true

          def multiple_play_roles
            find_multiple

            @result = []

            @hostgroups.uniq.each do |hostgroup|
              @result.append(
                :hostgroup => hostgroup, :foreman_tasks => async_task(
                  ::Actions::ForemanAnsible::PlayHostgroupRoles, hostgroup
                )
              )
            end

            render_message @result
          end

          api :POST, '/hostgroups/:id/play_ad_hoc_role',
              N_('Plays an Ansible role ad hoc')
          param :id, :identifier, :required => true
          param :the_role_id, String, :required => true

          def play_ad_hoc_role
            # FIXME: When using just role_id, find resource will throw an
            # exception: "undefined method `name' for nil:NilClass"
            find_resource
            find_ansible_role(params.require(:the_role_id))

            @result = {
              :hostgroup => @hostgroup, :role => @ansible_role,
              :foreman_tasks => async_task(
                ::Actions::ForemanAnsible::PlayHostgroupRole,
                @hostgroup, @ansible_role
              )
            }

            render_message @result
          end
        end

        private

        def find_ansible_role(id)
          @ansible_role = AnsibleRole.find(id)
        end

        def find_multiple
          hostgroup_ids = params.fetch(:hostgroup_ids, [])
          hostgroup_names = params.fetch(:hostgroup_names, [])

          @hostgroups = []
          hostgroup_ids.uniq.each do |hostgroup_id|
            @hostgroups.append(Hostgroup.find(hostgroup_id))
          end
          hostgroup_names.uniq.each do |hostgroup_name|
            @hostgroups.append(Hostgroup.find_by(:name => hostgroup_name))
          end
        end

        def action_permission
          case params[:action]
          when 'play_roles', 'play_ad_hoc_role'
            :view
          else
            super
          end
        end
      end
    end
  end
end
