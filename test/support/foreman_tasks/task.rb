module Support
  module ForemanTasks
    # Stubbing for foreman tasks
    module Task
      def stub_tasks!
        @controller.stubs(:sync_task).returns(build_task_stub)
        @controller.stubs(:async_task).returns(build_task_stub)
      end

      def build_task_stub
        task_attrs = [:id, :label, :pending, :username, :started_at, :ended_at,
                      :state, :result, :progress, :input, :humanized,
                      :cli_example].inject({}) { |a, e| a.update e => nil }
        task_attrs[:output] = {}

        stub('task', task_attrs).mimic!(::ForemanTasks::Task)
      end

      def assert_async_task(expected_action_class, *args_expected)
        assert_foreman_task(true, expected_action_class, *args_expected)
      end

      def assert_sync_task(expected_action_class, *args_expected)
        assert_foreman_task(false, expected_action_class, *args_expected)
      end

      def assert_foreman_task(async, expected_action_class, *args_expected)
        block ||= block_from_args(args_expected)
        method = async ? :async_task : :sync_task
        task_stub = build_task_stub
        @controller.
          expects(method).
          with do |action_class, *args|
            expected_action_class == action_class && block.call(*args)
          end.
          returns(task_stub)
        task_stub
      end

      private

      def block_from_args(args_expected)
        ->(*_) { true } if args_expected.empty?
        ->(*args) { args == args_expected }
      end
    end
  end
end
