module Resolvers
  module AnsibleRole
    class Path < Resolvers::BaseResolver
      type String, null: false

      def resolve
        Rails.application.routes.url_helpers.ansible_roles_path(search: "name = #{object.name}")
      end
    end
  end
end
