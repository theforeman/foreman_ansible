# frozen_string_literal: true

module ForemanAnsible
  module Concerns
    # Helpers to compose the JobInvocation in other controllers
    module JobInvocationHelper
      extend ActiveSupport::Concern

      def job_composer(feature_name, target)
        composer = ::JobInvocationComposer.for_feature(feature_name, target)
        return composer if composer.save
        msg = if target.blank?
                N_('There are no Ansible roles to play')
              else
                format(N_('Could not run Ansible roles for %{host}'),
                       :host => target)
              end
        raise ::Foreman::Exception.new(msg)
      end

      private

      def hostgroup_search(hostgroups)
        Array(hostgroups).map do |hostgroup|
          %Q[parent_hostgroup = "#{hostgroup.title}"]
        end.join(' or ')
      end
    end
  end
end
