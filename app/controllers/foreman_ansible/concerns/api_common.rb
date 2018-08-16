module ForemanAnsible
  module Concerns
    # Shared task methods between api controllers
    module ApiCommon
      extend ActiveSupport::Concern

      def find_ansible_roles
        ids = params.fetch(:ansible_role_ids, []) || []
        @ansible_roles = []
        ids.uniq.each do |id|
          begin
            @ansible_roles << find_ansible_role(id)
          rescue ActiveRecord::RecordNotFound => e
            return not_found(e.message)
          end
        end
      end

      def find_ansible_role(id)
        @ansible_role = AnsibleRole.find(id)
      end
    end
  end
end
