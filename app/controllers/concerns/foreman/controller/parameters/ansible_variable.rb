# frozen_string_literal: true

module Foreman
  module Controller
    module Parameters
      # Keys to allow as parameters in the AnsibleVariable controller
      module AnsibleVariable
        extend ActiveSupport::Concern
        include Foreman::Controller::Parameters::LookupKey

        class_methods do
          def ansible_variable_params_filter
            Foreman::ParameterFilter.new(::AnsibleVariable).tap do |filter|
              filter.permit :imported, :ansible_role_id,
                            :ansible_roles => [], :ansible_role_ids => [],
                            :ansible_role_names => [],
                            :param_classes => [], :param_classes_ids => [],
                            :param_classes_names => []
              filter.permit_by_context :required, :nested => true
              filter.permit_by_context :id, :ui => false, :api => false,
                                            :nested => true

              add_lookup_key_params_filter(filter)
            end
          end
        end

        def ansible_variable_params
          self.class.ansible_variable_params_filter.filter_params(
            params,
            parameter_filter_context
          )
        end
      end
    end
  end
end
