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

        def fill_continuous_output(continuous_output)
          delegated_output.fetch('result', []).each do |raw_output|
            continuous_output.add_raw_output(raw_output)
          end
        rescue StandardError => e
          continuous_output.add_exception(_('Error loading data from proxy'), e)
        end

        def find_options
          { :verbosity_level => Setting[:ansible_verbosity] }
        end
      end
    end
  end
end
