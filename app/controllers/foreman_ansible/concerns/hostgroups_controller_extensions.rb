module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostgroupsControllerExtensions
      extend ActiveSupport::Concern
      include ForemanTasks::Triggers

      def play_roles
        find_resource
        task = async_task(
          ::Actions::ForemanAnsible::PlayHostgroupRoles,
          @hostgroup
        )
        redirect_to task
      rescue Foreman::Exception => e
        error e.message
        redirect_to hostgroups_path
      end

      def play_ad_hoc_role
        find_resource
        @ansible_role = AnsibleRole.find(params[:ansible_role][:id])
        task = async_task(
          ::Actions::ForemanAnsible::PlayHostgroupRole,
          @hostgroup, @ansible_role
        )
        redirect_to task
      rescue Foreman::Exception => e
        error e.message
        redirect_to hostgroups_path
      end

      private

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
