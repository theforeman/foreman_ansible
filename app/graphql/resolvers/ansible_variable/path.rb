module Resolvers
  module AnsibleVariable
    class Path < Resolvers::BaseResolver
      type String, null: false

      def resolve
        Rails.application.routes.url_helpers.edit_ansible_variable_path(object.ansible_variable)
      end
    end
  end
end
