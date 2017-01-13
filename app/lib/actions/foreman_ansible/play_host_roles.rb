module Actions
  module ForemanAnsible
    # Action that initiates the playbook run for roles assigned to
    # the host. It does that either locally or via a proxy when available.
    class PlayHostRoles < Actions::EntryAction
      include ::Actions::Helpers::WithContinuousOutput
      include ::Actions::Helpers::WithDelegatedAction

      def plan(host, proxy_selector = ::ForemanAnsible::ProxySelector.new)
        input[:host] = { :id => host.id, :name => host.fqdn }
        proxy = proxy_selector.determine_proxy(host)
        inventory_creator = ::ForemanAnsible::InventoryCreator.new([host])
        role_names = host.all_ansible_roles.map(&:name)
        playbook_creator = ::ForemanAnsible::PlaybookCreator.new(role_names)
        plan_delegated_action(proxy, ::ForemanAnsibleCore::Actions::RunPlaybook,
                              :inventory => inventory_creator.to_hash.to_json,
                              :playbook => playbook_creator.roles_playbook)
        plan_self
      end

      def finalize
        if delegated_output[:exit_status].to_s != '0'
          error! _('Playbook execution failed')
        end
      end

      def rescue_strategy
        ::Dynflow::Action::Rescue::Fail
      end

      def humanized_input
        _('on host %{name}') % { :name => input.fetch(:host, {})[:name] }
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
