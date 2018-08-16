# frozen_string_literal: true

module ForemanAnsible
  module Api
    module V2
      # Extends the hosts controller to support playing ansible roles
      module HostsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include ::ForemanAnsible::Concerns::JobInvocationHelper

        included do
          def find_resource
            return true if params[:action] == 'multiple_play_roles'
            super
          end

          api :POST, '/hosts/:id/play_roles',
              N_('Plays Ansible roles on a host')
          param :id, :identifier, :required => true

          def play_roles
            composer = job_composer(:ansible_run_host, @host)
            process_response composer.trigger!, composer.job_invocation
          end

          api :POST, '/hosts/multiple_play_roles',
              N_('Plays Ansible roles on hosts')
          param :host_ids, Array, N_('IDs of hosts to play roles on'),
                :required => true

          def multiple_play_roles
            host_ids = params.fetch(:host_ids, []).uniq
            composer = job_composer(:ansible_run_host, host_ids)
            process_response composer.trigger!, composer.job_invocation
          end

          api :GET, '/hosts/:id/ansible_roles',
              N_('List all Ansible roles for a host')
          param :id, :identifier, :required => true

          def ansible_roles
            return unless @host
            @ansible_roles = @host.all_ansible_roles
          end
        end

        private

        def action_permission
          case params[:action]
          when 'play_roles', 'multiple_play_roles', 'ansible_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
