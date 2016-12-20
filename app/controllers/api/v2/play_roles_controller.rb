module Api
  module V2
    # API controller for Ansible Plays
    class PlayRolesController < ::Api::V2::BaseController
      include ::Api::Version2
      include ForemanTasks::Triggers

      rescue_from ActiveRecord::RecordNotFound, :with => :resource_not_found

      before_action :find_hosts, :only => [:play_roles_on_host]
      before_action :find_hostgroups, :only => [:play_roles_on_hostgroup]

      api :POST, '/ansible/play_roles_on_host', N_('Plays Ansible roles on hosts')
      param :play_roles, Hash, :required => true do
        param :host_ids, Array, :required => false, :desc => N_('Array of host IDs')
        param :host_names, Array, :required => false, :desc => N_('Array of host names')
      end

      def play_roles_on_host
        @result = []

        @hosts.uniq.each do |host|
          @result.append(
            :host => host, :foreman_tasks => async_task(
              ::Actions::ForemanAnsible::PlayHostRoles, host
            )
          )
        end

        render :json => @result
      end

      api :POST, '/ansible/play_roles_on_hostgroup', N_('Plays Ansible roles on hostgroups')
      param :play_roles, Hash, :required => true do
        param :host_ids, Array, :required => false, :desc => N_('Array of host IDs')
        param :host_names, Array, :required => false, :desc => N_('Array of host names')
      end

      def play_roles_on_hostgroup
        @result = []

        @hostgroups.uniq.each do |hostgroup|
          @result.append(
            :hostgroup => hostgroup, :foreman_tasks => async_task(
              ::Actions::ForemanAnsible::PlayHostgroupRoles, hostgroup
            )
          )
        end

        render :json => @result
      end

      protected

      def resource_not_found(e)
        @result = { :error => e.message }
        render :json => @result, :status => :error
      end

      private

      def find_hosts
        play_roles = params.require(:play_roles).permit(:host_ids => [],
                                                        :host_names => [])
        host_ids = play_roles.fetch(:host_ids, [])
        host_names = play_roles.fetch(:host_names, [])

        @hosts = []
        host_ids.uniq.each do |host_id|
          @hosts.append(Host.find(host_id))
        end
        host_names.uniq.each do |host_name|
          @hosts.append(Host.find_by(:name => host_name))
        end
      end

      def find_hostgroups
        play_roles = params.require(:play_roles).permit(:hostgroup_ids => [],
                                                        :hostgroup_names => [])
        hostgroup_ids = play_roles.fetch(:hostgroup_ids, [])
        hostgroup_names = play_roles.fetch(:hostgroup_names, [])

        @hostgroups = []
        hostgroup_ids.uniq.each do |hostgroup_id|
          @hostgroups.append(Hostgroup.find(hostgroup_id))
        end
        hostgroup_names.uniq.each do |hostgroup_name|
          @hostgroups.append(Hostgroup.find_by(:name => hostgroup_name))
        end
      end
    end
  end
end
