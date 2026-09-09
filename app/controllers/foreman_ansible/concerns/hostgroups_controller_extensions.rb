# frozen_string_literal: true

module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostgroupsControllerExtensions
      extend ActiveSupport::Concern
      include ForemanTasks::Triggers
      include ::ForemanAnsible::Concerns::JobInvocationHelper

      def play_roles
        find_resource
        search = hostgroup_search(@hostgroup)
        check_hostgroup(search)
        composer = job_composer(:ansible_run_host, search)
        composer.trigger
        redirect_to job_invocation_path(composer.job_invocation)
      rescue Foreman::Exception => e
        error e.message
        redirect_to hostgroups_path
      end

      private

      def check_hostgroup(search)
        return if Host::Managed.search_for(search).exists?
        raise ::Foreman::Exception.new(
          N_('Host group has no associated hosts')
        )
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
