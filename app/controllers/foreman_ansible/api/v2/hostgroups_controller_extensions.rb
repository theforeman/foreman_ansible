# frozen_string_literal: true

module ForemanAnsible
  module Api
    module V2
      # Extends the hostgroups controller to support playing ansible roles
      module HostgroupsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include ::ForemanAnsible::Concerns::JobInvocationHelper
        include ::ForemanAnsible::Concerns::ApiCommon

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        # rubocop:disable Rails/LexicallyScopedActionFilter
        included do
          before_action :find_ansible_roles, :only => [:assign_ansible_roles]
          before_action :find_hostgroup_ansible_role, :only => [:add_ansible_role, :remove_ansible_role]

          api :POST, '/hostgroups/:id/play_roles',
              N_('Runs all Ansible roles on a hostgroup')
          param :id, :identifier, :required => true

          def play_roles
            find_resource
            composer = job_composer(:ansible_run_host, @hostgroup.hosts)
            process_response composer.trigger!, composer.job_invocation
          end

          api :POST, '/hostgroups/multiple_play_roles',
              N_('Runs all Ansible roles on hostgroups')
          param :hostgroup_ids, Array, N_('IDs of hostgroups to play roles on'),
                :required => true

          def multiple_play_roles
            find_multiple
            composer = job_composer(:ansible_run_host,
                                    @hostgroups.map(&:host_ids).flatten.uniq)
            process_response composer.trigger!, composer.job_invocation
          end

          api :GET, '/hostgroups/:id/ansible_roles',
              N_('List all Ansible roles for a hostgroup')
          param :id, :identifier, :required => true

          def ansible_roles
            find_resource
            return unless @hostgroup

            @inherited_ansible_roles = @hostgroup.inherited_ansible_roles
            @directly_assigned_roles = @hostgroup.ansible_roles
            @ansible_roles = (
              @directly_assigned_roles + @inherited_ansible_roles + @hostgroup.host_ansible_roles
            ).uniq
          end

          api :POST, '/hostgroups/:id/assign_ansible_roles',
              N_('Assigns Ansible roles to a hostgroup')
          param :id, :identifier, :required => true
          param :ansible_role_ids, Array,
                N_('Ansible roles to assign to a hostgroup'),
                :required => true

          def assign_ansible_roles
            find_resource
            process_response @hostgroup.update(:ansible_roles => @ansible_roles)
          end

          api :PUT, '/hostgroups/:id/ansible_roles/:ansible_role_id',
              N_('Directly add an Ansible role to a hostgroup')
          param :id, :identifier, :required => true
          param :ansible_role_id, :identifier,
                N_('Ansible role to add to a hostgroup'),
                :required => true

          def add_ansible_role
            process_response @hostgroup.ansible_roles << @ansible_role
          rescue ActiveRecord::RecordInvalid => e
            render_exception(e, :status => :unprocessable_entity)
          end

          api :DELETE, '/hostgroups/:id/ansible_roles/:ansible_role_id',
              N_('Remove directly assigned Ansible role from a hostgroup')
          param :id, :identifier, :required => true
          param :ansible_role_id, :identifier,
                N_('Ansible role to remove from a hostgroup'),
                :required => true

          def remove_ansible_role
            process_response @hostgroup.ansible_roles.delete(@ansible_role)
          end
        end
        # rubocop:enable Rails/LexicallyScopedActionFilter

        private

        def find_multiple
          hostgroup_ids = params.fetch(:hostgroup_ids, [])
          hostgroup_names = params.fetch(:hostgroup_names, [])

          @hostgroups = []
          hostgroup_ids.uniq.each do |hostgroup_id|
            @hostgroups.append(Hostgroup.find(hostgroup_id))
          end
          hostgroup_names.uniq.each do |hostgroup_name|
            @hostgroups.append(Hostgroup.find_by(:name => hostgroup_name))
          end
        end

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
