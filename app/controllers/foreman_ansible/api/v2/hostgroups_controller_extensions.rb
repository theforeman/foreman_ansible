module ForemanAnsible
  module Api
    module V2
      # Extends the hostgroups controller to support playing ansible roles
      module HostgroupsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include Api::V2::Concerns::ApiCommon

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        # rubocop:disable BlockLength
        included do
          before_action :find_ansible_roles, :only => [:ansible_roles]
          before_action :find_resource, :only => [:play_roles,
                                                  :list_ansible_roles,
                                                  :ansible_roles]
          before_action :find_multiple, :only => [:multiple_play_roles]

          api :POST, '/hostgroups/play_roles',
              N_('Plays Ansible roles on hostgroups')
          param :id, Array, :required => true

          def play_roles
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

          api :GET, '/hostgroups/:id/list_ansible_roles',
              N_('Lists assigned Ansible roles')
          param :id, :identifier, :required => true

          def list_ansible_roles
            @result = {
              :roles => @hostgroup.all_ansible_roles
            }

            render_message @result
          end

          api :POST, '/hostgroups/:id/ansible_roles',
              N_('Assigns Ansible roles to a host group')
          param :id, :identifier, :required => true
          param :roles, Array, :required => true

          def ansible_roles
            @hostgroup.ansible_roles = @roles

            @result = {
              :roles => @roles,
              :hostgroup => @hostgroup
            }

            render_message @result
          end
        end

        private

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
          when 'play_roles', 'ansible_roles', 'list_ansible_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
