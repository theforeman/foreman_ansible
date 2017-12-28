module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostgroupsControllerExtensions
      extend ActiveSupport::Concern
      include ForemanTasks::Triggers
      include ::ForemanAnsible::Concerns::JobInvocationHelper

      def play_roles
        find_resource
        composer = job_composer(:ansible_run_host, @hostgroup.hosts)
        composer.trigger
        redirect_to job_invocation_path(composer.job_invocation)
      rescue Foreman::Exception => e
        error e.message
        redirect_to hostgroups_path
      end

      private

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
