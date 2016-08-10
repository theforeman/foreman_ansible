module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostsControllerExtensions
      extend ActiveSupport::Concern
      include ForemanTasks::Triggers

      def play_roles
        find_resource
        task = async_task(::Actions::ForemanAnsible::PlayHostRoles, @host)
        redirect_to task
      end

      def multiple_play_roles
        find_multiple
        task = async_task(::Actions::ForemanAnsible::PlayHostsRoles, @hosts)
        redirect_to task
      end

      private

      def action_permission
        case params[:action]
        when 'multiple_play_roles', 'play_roles'
          :view
        else
          super
        end
      end
    end
  end
end
