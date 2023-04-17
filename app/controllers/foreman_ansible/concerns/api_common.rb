# frozen_string_literal: true

module ForemanAnsible
  module Concerns
    # Shared task methods between api controllers
    module ApiCommon
      extend ActiveSupport::Concern

      def find_ansible_roles
        ids = params.fetch(:ansible_role_ids, []) || []
        @ansible_roles = AnsibleRole.authorized(:view_ansible_roles).find(ids)
      rescue ActiveRecord::RecordNotFound => e
        not_found(e.message)
      end

      def find_ansible_role
        @ansible_role = AnsibleRole.authorized(:view_ansible_roles).find(params[:ansible_role_id])
      rescue ActiveRecord::RecordNotFound => e
        not_found(e.message)
      end

      def find_host_ansible_role
        find_ansible_role
        @host = Host.authorized(:view_hosts).find(params[:id])
      rescue ActiveRecord::RecordNotFound => e
        not_found(e.message)
      end

      def find_hostgroup_ansible_role
        find_ansible_role
        @hostgroup = Hostgroup.authorized(:view_hostgroups).find(params[:id])
      rescue ActiveRecord::RecordNotFound => e
        not_found(e.message)
      end
    end
  end
end
