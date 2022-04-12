# frozen_string_literal: true

require 'foreman_remote_execution'

module ForemanAnsible
  # Dependencies related with the remote execution plugin
  class Engine < ::Rails::Engine
    config.to_prepare do
      RemoteExecutionProvider.register(
        :Ansible,
        ForemanAnsible::AnsibleProvider
      )

      ForemanAnsible::Engine.register_rex_feature
    end

    def self.register_rex_feature
      RemoteExecutionFeature.register(
        :ansible_run_host,
        N_('Run Ansible roles'),
        :description => N_('Runs an Ansible playbook which contains all'\
                           ' the roles defined for a host'),
        :host_action_button => true
      )
      RemoteExecutionFeature.register(
        :ansible_run_insights_plan,
        N_('Ansible: Run Insights maintenance plan'),
        :description => N_('Runs a given maintenance plan from Red Hat '\
                           'Access Insights given an ID.'),
        :provided_inputs => %w[organization_id plan_id],
        :notification_builder => ForemanAnsible::InsightsNotificationBuilder
      )
      RemoteExecutionFeature.register(
        :ansible_run_playbook,
        N_('Run playbook'),
        :description => N_('Run an Ansible playbook against given hosts'),
        :provided_inputs => %w[playbook]
      )
      RemoteExecutionFeature.register(
        :ansible_enable_web_console,
        N_('Enable web console'),
        :description => N_('Run an Ansible playbook to enable web console on given hosts'),
        :host_action_button => true
      )
      RemoteExecutionFeature.register(
        :ansible_run_capsule_upgrade,
        N_('Upgrade Capsules on given hosts'),
        :description => N_('Upgrade Capsules on given Capsule server hosts'),
        :proxy_selector_override => ::RemoteExecutionProxySelector::INTERNAL_PROXY
      )
    end
  end
end
