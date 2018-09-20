# frozen_string_literal: true

module ForemanAnsible
  module Api
    module V2
      # Extends the hosts controller to support playing ansible roles
      module HostsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include ::ForemanAnsible::Concerns::JobInvocationHelper
        include ::ForemanAnsible::Concerns::ApiCommon

        included do
          before_action :find_ansible_roles, :only => [:assign_ansible_roles]

          api :POST, '/hosts/:id/play_roles',
              N_('Plays Ansible roles on a host')
          param :id, String, :required => true

          def play_roles
            composer = job_composer(:ansible_run_host, @host)
            process_response composer.trigger!, composer.job_invocation
          end

          api :POST, '/hosts/play_roles', N_('Plays Ansible roles on hosts')
          param :id, Array, :required => true

          def multiple_play_roles
            composer = job_composer(:ansible_run_host, @host.pluck(:id))
            process_response composer.trigger!, composer.job_invocation
          end

          api :POST, '/hosts/:id/assign_ansible_roles',
              N_('Assigns Ansible roles to a host')
          param :id, :identifier, :required => true
          param :ansible_role_ids, Array,
                N_('Ansible roles to assign to a host'),
                :required => true

          def assign_ansible_roles
            process_response @host.update(:ansible_roles => @ansible_roles)
          end
        end

        private

        def action_permission
          case params[:action]
          when 'play_roles', 'multiple_play_roles', 'assign_ansible_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
