module ForemanAnsibleCore
  module RemoteExecutionCore
    # Takes an inventory and runs it through REXCore CommandRunner
    class AnsibleRunner < ::ForemanTasksCore::Runner::CommandRunner
      DEFAULT_REFRESH_INTERVAL = 1

      def initialize(options)
        super(options)
        @playbook_runner = ForemanAnsibleCore::PlaybookRunner.new(
          options['ansible_inventory'],
          options['script'],
          options
        )
      end

      def start
        @playbook_runner.start
      rescue StandardError => e
        logger.error(
          'error while initalizing command'\
          " #{e.class} #{e.message}:\n #{e.backtrace.join("\n")}"
        )
        publish_exception('Error initializing command', e)
      end

      def fill_continuous_output(continuous_output)
        delegated_output.fetch('result', []).each do |raw_output|
          continuous_output.add_raw_output(raw_output)
        end
      rescue StandardError => e
        continuous_output.add_exception(_('Error loading data from proxy'), e)
      end

      def refresh
        @command_out = @playbook_runner.command_out
        @command_in = @playbook_runner.command_in
        @command_pid = @playbook_runner.command_pid
        super
      end
    end
  end
end
