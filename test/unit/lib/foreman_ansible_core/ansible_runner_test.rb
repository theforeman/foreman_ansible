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
    end
  end
end
