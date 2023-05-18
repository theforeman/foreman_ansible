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

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        # rubocop:disable Rails/LexicallyScopedActionFilter
        included do
          skip_before_action :find_resource, :only => [:add_ansible_role, :remove_ansible_role]
          before_action :find_ansible_roles, :only => [:assign_ansible_roles]
          before_action :find_host_ansible_role, :only => [:add_ansible_role, :remove_ansible_role]

          def find_resource
            return true if params[:action] == 'multiple_play_roles'

            super
          end

          api :POST, '/hosts/:id/play_roles',
              N_('Runs all Ansible roles on a host')
          param :id, :identifier, :required => true

          def play_roles
            composer = job_composer(:ansible_run_host, @host)
            process_response composer.trigger!, composer.job_invocation
          end

          api :POST, '/hosts/multiple_play_roles',
              N_('Runs all Ansible roles on hosts')
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

            @inherited_ansible_roles = @host.inherited_ansible_roles
            @directly_assigned_roles = @host.ansible_roles
            @ansible_roles = (@directly_assigned_roles + @inherited_ansible_roles).uniq
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

          api :PUT, '/hosts/:id/ansible_roles/:ansible_role_id',
              N_('Directly add an Ansible role to a host')
          param :id, :identifier, :required => true
          param :ansible_role_id, :identifier,
                N_('Ansible role to add to a host'),
                :required => true

          def add_ansible_role
            process_response @host.ansible_roles << @ansible_role
          rescue ActiveRecord::RecordInvalid => e
            render_exception(e, :status => :unprocessable_entity)
          end

          api :DELETE, '/hosts/:id/ansible_roles/:ansible_role_id',
              N_('Remove directly assigned Ansible role from a host')
          param :id, :identifier, :required => true
          param :ansible_role_id, :identifier,
                N_('Ansible role to remove from a host'),
                :required => true

          def remove_ansible_role
            process_response @host.ansible_roles.delete(@ansible_role)
          end
        end
        # rubocop:enable Rails/LexicallyScopedActionFilter

        private

        def action_permission
          case params[:action]
          when 'play_roles', 'multiple_play_roles', 'ansible_roles',
               'assign_ansible_roles'
            :view
          when 'add_ansible_role', 'remove_ansible_role'
            :edit
          else
            super
          end
        end
      end
    end
  end
end
