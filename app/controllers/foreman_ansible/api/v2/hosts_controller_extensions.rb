module ForemanAnsible
  module Api
    module V2
      # Extends the hosts controller to support playing ansible roles
      module HostsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include ::ForemanAnsible::Concerns::JobInvocationHelper

        included do
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
            composer = job_composer(:ansible_run_host, @host)
            process_response composer.trigger!, composer.job_invocation
          end
        end

        private

        def action_permission
          case params[:action]
          when 'play_roles', 'multiple_play_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
