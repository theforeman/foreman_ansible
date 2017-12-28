module ForemanAnsible
  module Concerns
    # Helpers to compose the JobInvocation in other controllers
    module JobInvocationHelper
      extend ActiveSupport::Concern

      def job_composer(feature_name, target)
        composer = ::JobInvocationComposer.for_feature(feature_name, target)
        return composer if composer.save
        raise ::Foreman::Exception.new(
          format(N_('Could not run Ansible roles for %{host}'),
                 :host => target)
        )
      end
    end
  end
end
