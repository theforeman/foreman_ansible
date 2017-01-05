module Api
  module V2
    # Extends the hostgroups controller to support playing ansible roles
    module HostgroupsControllerExtensions
      include ForemanTasks::Triggers

      # TODO: How to add this to API v2 controller?
      # api :POST, '/hostgroups/play_roles', N_('Plays Ansible roles on hostgroups')
      # param :id, Array, :required => true

      def play_roles
        find_resource

        @result = {
          :hostgroup => @hostgroup, :foreman_tasks => async_task(
            ::Actions::ForemanAnsible::PlayHostgroupRoles, @hostgroup
          )
        }

        render_message @result
      end

      # TODO: How to add this to API v2 controller?
      # api :POST, '/hostgroups/play_roles', N_('Plays Ansible roles on hostgroups')
      # param :id, Array, :required => true

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

      private

      # TODO: A better implementation of find_multiple should be available in hostgroups_controller

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
        when 'play_roles'
          :view
        else
          super
        end
      end
    end
  end
end
