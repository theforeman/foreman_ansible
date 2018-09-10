# frozen_string_literal: true

module Actions
  module ForemanAnsible
    module Helpers
      # Returns the name of the proxy running the specified action, or Foreman
      # if it's the one running the action instead.
      module PlayRolesDescription
        def running_proxy_name
          proxy = input.fetch(:host, {})[:proxy_used]
          proxy ||= input.fetch(:hostgroup, {})[:proxy_used]
          if [:not_defined, 'Foreman'].include? proxy
            _('Foreman')
          else
            proxy
          end
        end
      end
    end
  end
end
