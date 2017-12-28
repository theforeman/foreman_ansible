module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostsControllerExtensions
      extend ActiveSupport::Concern
      include ForemanTasks::Triggers
      include JobInvocationHelper

      # Overrides to methods in the original hosts controller
      module Overrides
        def action_permission
          case params[:action]
          when 'multiple_play_roles', 'play_roles'
            :view
          else
            super
          end
        end
      end

      included do
        prepend Overrides
      end

      def play_roles
        find_resource
        composer = job_composer(:ansible_run_host, @host)
        composer.trigger
        redirect_to job_invocation_path(composer.job_invocation)
      rescue Foreman::Exception => e
        error e.message
        redirect_to host_path(@host)
      end

      def multiple_play_roles
        find_multiple
        composer = job_composer(:ansible_run_host, @hosts)
        composer.trigger
        redirect_to job_invocation_path(@composer.job_invocation)
      rescue Foreman::Exception => e
        error e.message
        redirect_to hosts_path
      end
    end
  end
end
