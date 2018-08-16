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
        # rubocop:disable BlockLength
        included do
          before_action :find_ansible_roles, :only => [:assign_ansible_roles]

          api :POST, '/hostgroups/:id/play_roles',
              N_('Plays Ansible roles on a hostgroup')
          param :id, String, :required => true

          def play_roles
            find_resource
            composer = job_composer(:ansible_run_host, @hostgroup.hosts)
            process_response composer.trigger!, composer.job_invocation
          end

          api :POST, '/hostgroups/play_roles',
              N_('Plays Ansible roles on hostgroups')
          param :id, Array, :required => true

          def multiple_play_roles
            find_multiple
            composer = job_composer(:ansible_run_host,
                                    @hostgroups.map(&:host_ids).flatten.uniq)
            process_response composer.trigger!, composer.job_invocation
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
        end
        # rubocop:enable BlockLength

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
          when 'play_roles', 'assign_ansible_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
