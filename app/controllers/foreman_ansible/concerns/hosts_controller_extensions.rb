module ForemanAnsible
  module Concerns
    # Extra methods to enforce Ansible roles on a host or multiple hosts
    module HostsControllerExtensions
      extend ActiveSupport::Concern

      def play_roles
        find_resource
        RolePlayer.new(@host).play
        notice(_('Ansible roles running on background: ') +
               @host.all_ansible_roles.map(&:name).join(', '))
        redirect_to :back
      end

      def multiple_play_roles
        find_multiple
        @hosts.each do |host|
          RolePlayer.new(host).play
        end
        notice(_('Ansible roles running on background for hosts: ') +
               @hosts.map(&:name).join(', '))
        redirect_to :hosts
      end

      private

      def action_permission
        case params[:action]
        when 'multiple_play_roles', 'play_roles'
          :view
        else
          super
        end
      end
    end
  end
end
