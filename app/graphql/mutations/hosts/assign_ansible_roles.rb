module Mutations
  module Hosts
    class AssignAnsibleRoles < ::Mutations::UpdateMutation
      resource_class Host::Managed

      argument :ansible_role_ids, [Integer], required: true

      field :host, Types::Host, 'The updated host.', null: false

      def resolve(id:, ansible_role_ids:)
        host = load_object_by(id: id)
        authorize!(host, :edit)

        existing = host.host_ansible_roles
        updated_ids = []
        attrs = []

        ansible_role_ids.each do |role_id|
          current = existing.find_by :ansible_role_id => role_id
          attrs << { :id => current&.id, :position => attrs.count + 1, :ansible_role_id => role_id }
          updated_ids << current.id if current
        end

        existing.where.not(:id => updated_ids).each do |item|
          attrs << { :id => item.id, :position => attrs.count + 1, :_destroy => true }
        end

        host.host_ansible_roles_attributes = attrs
        save_object(host)
      end

      def result_key
        :host
      end
    end
  end
end
