module ForemanAnsible
  module Api
    module V2
      # Extends the hostgroups controller to support playing ansible roles
      module HostgroupsControllerExtensions
        extend ActiveSupport::Concern
        include ForemanTasks::Triggers
        include ::ForemanAnsible::Concerns::JobInvocationHelper

        # Included blocks shouldn't be bound by length, as otherwise concerns
        # cannot extend the method properly.
        included do
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
                                    @hostgroups.map(&:hosts).flatten.uniq)
            process_response composer.trigger!, composer.job_invocation
          end
        end

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
          when 'play_roles'
            :view
          else
            super
          end
        end
      end
    end
  end
end
