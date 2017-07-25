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

        def find_options
          { :verbosity_level => Setting[:ansible_verbosity] }
        end

        private

        def find_host_and_proxy(host, proxy_selector)
          proxy = proxy_selector.determine_proxy(host)
          input[:host] = { :id => host.id,
                           :name => host.fqdn,
                           :proxy_used => proxy.try(:name) || :not_defined }
          proxy
        end

        def hostgroup_contains_hosts(hostgroup)
          return unless hostgroup.hosts.empty?
          raise ::Foreman::Exception.new(N_('host group is empty'))
        end

        def find_hostgroup_and_proxy(hostgroup, proxy_selector)
          hostgroup_contains_hosts(hostgroup)
          proxy = proxy_selector.determine_proxy(hostgroup.hosts[0])
          input[:hostgroup] = { :id => hostgroup.id,
                                :name => hostgroup.name,
                                :proxy_used => proxy.try(:name) ||
                                               :not_defined }
          proxy
        end
      end
    end
  end
end
