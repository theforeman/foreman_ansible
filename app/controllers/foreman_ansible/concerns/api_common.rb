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
    end
  end
end
