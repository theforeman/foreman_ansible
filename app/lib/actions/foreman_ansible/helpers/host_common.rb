module Actions
  module ForemanAnsible
    module Helpers
      # Shared task methods between hostgroup and host roles actions
      module HostCommon
        def finalize
          return unless delegated_output[:exit_status].to_s != '0'
          error! _('Playbook execution failed')
        end

        def rescue_strategy
          ::Dynflow::Action::Rescue::Fail
        end

        def humanized_name
          _('Play Ansible roles')
        end

        def humanized_output
          continuous_output.humanize
        end

        def continuous_output_providers
          super << self
        end

        def fill_continuous_output(continuous_output)
          delegated_output.fetch('result', []).each do |raw_output|
            continuous_output.add_raw_output(raw_output)
          end
        rescue => e
          continuous_output.add_exception(_('Error loading data from proxy'), e)
        end
      end
    end
  end
end
