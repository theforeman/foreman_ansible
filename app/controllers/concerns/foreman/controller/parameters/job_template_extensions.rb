module Foreman
  module Controller
    module Parameters
      module JobTemplateExtensions
        extend ActiveSupport::Concern

        class_methods do
          def job_template_params_filter
            super.tap do |filter|
              filter.permit :ansible_callback_enabled
            end
          end
        end
      end
    end
  end
end
