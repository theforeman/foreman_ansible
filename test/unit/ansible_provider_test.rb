# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for the behavior of Ansible Role, currently only validations
class AnsibleProviderTest < ActiveSupport::TestCase
  describe '.proxy_command_options' do
    let(:template_invocation) { FactoryBot.create(:template_invocation) }
    let(:dummyhost) { FactoryBot.create(:host) }

    it 'adds an ansible inventory' do
      assert command_options['ansible_inventory']
    end

    context 'when it is not using the ansible_run_host feature' do
      it 'sets enables :remote_execution_command to true' do
        assert command_options[:remote_execution_command]
      end
    end

    context 'when it is using the ansible_run_host feature' do
      let(:rex_feature) do
        RemoteExecutionFeature.where(:label => 'ansible_run_host').first
      end

      it 'has remote_execution_command false' do
        template_invocation.template.remote_execution_features << rex_feature
        assert_not command_options[:remote_execution_command]
      end
    end

    def command_options
      ForemanAnsible::AnsibleProvider.
        proxy_command_options(template_invocation, dummyhost)
    end
  end
end
