module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostsControllerExtensions
      extend ActiveSupport::Concern
      include ForemanTasks::Triggers

      included do
        alias_method_chain :action_permission, :ansible
      end

      def play_roles
        find_resource
        task = async_task(::Actions::ForemanAnsible::PlayHostRoles, @host)
        redirect_to task
      rescue Foreman::Exception => e
        error e.message
        redirect_to host_path(@host)
      end

      def multiple_play_roles
        find_multiple
        task = async_task(::Actions::ForemanAnsible::PlayHostsRoles, @hosts)
        redirect_to task
      rescue Foreman::Exception => e
        error e.message
        redirect_to hosts_path
      end

      private

      def action_permission_with_ansible
        case params[:action]
        when 'multiple_play_roles', 'play_roles'
          :view
        else
          action_permission_without_ansible
        end
      end
    end
  end
end
