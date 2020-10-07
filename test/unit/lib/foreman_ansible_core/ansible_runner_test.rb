# frozen_string_literal: true

require 'test_helper'

module ForemanAnsibleCore
  module Runner
    class AnsibleRunnerTest < ActiveSupport::TestCase
      describe AnsibleRunner do
        it 'parses files without event data' do
          content = <<~JSON
            {"uuid": "a29d8592-f805-4d0e-b73d-7a53cc35a92e", "stdout": " [WARNING]: Consider using the yum module rather than running 'yum'.  If you", "counter": 8, "end_line": 8, "runner_ident": "e2d9ae11-026a-4f9f-9679-401e4b852ab0", "start_line": 7, "event": "verbose"}
          JSON

          File.expects(:read).with('fake.json').returns(content)
          runner = AnsibleRunner.allocate
          runner.expects(:handle_broadcast_data)
          assert runner.send(:handle_event_file, 'fake.json')
        end
      end

      describe '#rebuild_secrets' do
        let(:inventory) do
          { 'all' => { 'hosts' => ['foreman.example.com'] },
            '_meta' => { 'hostvars' => { 'foreman.example.com' => {} } } }
        end
        let(:input) do
          host_secrets = { 'ansible_password' => 'letmein', 'ansible_become_password' => 'iamroot' }
          secrets = { 'per-host' => { 'foreman.example.com' => host_secrets } }
          host_input = { 'input' => { 'action_input' => { 'secrets' => secrets } } }
          { 'foreman.example.com' => host_input }
        end
        let(:runner) { ForemanAnsibleCore::Runner::AnsibleRunner.allocate }

        test 'uses secrets from inventory' do
          test_inventory = inventory.merge('ssh_password' => 'sshpass', 'effective_user_password' => 'mypass')
          rebuilt = runner.send(:rebuild_secrets, test_inventory, input)
          host_vars = rebuilt.dig('_meta', 'hostvars', 'foreman.example.com')
          assert_equal 'sshpass', host_vars['ansible_password']
          assert_equal 'mypass', host_vars['ansible_become_password']
        end

        test 'host secrets are used when not overriden by inventory secrest' do
          rebuilt = runner.send(:rebuild_secrets, inventory, input)
          host_vars = rebuilt.dig('_meta', 'hostvars', 'foreman.example.com')
          assert_equal 'letmein', host_vars['ansible_password']
          assert_equal 'iamroot', host_vars['ansible_become_password']
        end
      end
    end
  end
end
