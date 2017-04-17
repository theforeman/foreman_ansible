module ForemanAnsible
  module Api
    module V2
      module Concerns
        # Shared task methods between api controllers
        module ApiCommon
          extend ActiveSupport::Concern

          def find_ansible_roles
            role_ids = params.fetch(:roles, [])
            # rails transforms empty arrays to nil but we want to be able
            # to remove all role assignments as well with an empty array
            role_ids = [] if role_ids.nil?

            @roles = []
            role_ids.uniq.each do |role_id|
              begin
                @roles.append(find_ansible_role(role_id))
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
  end
end
