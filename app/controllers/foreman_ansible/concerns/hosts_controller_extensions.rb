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

      def play_ad_hoc_role
        find_resource
        @ansible_role = AnsibleRole.find(params[:ansible_role][:id])
        task = async_task(
          ::Actions::ForemanAnsible::PlayHostRole,
          @host, @ansible_role
        )
        redirect_to task
      rescue Foreman::Exception => e
        error e.message
        redirect_to host_path(@host)
      end

      private

      def action_permission
        case params[:action]
        when 'multiple_play_roles', 'play_roles', 'play_ad_hoc_role'
          :view
        else
          super
        end
      end
    end
  end
end
