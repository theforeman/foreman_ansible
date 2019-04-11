# frozen_string_literal: true

module ForemanAnsibleCore
  module RemoteExecutionCore
    # Takes an inventory and runs it through REXCore CommandRunner
    class AnsibleRunner < ::ForemanTasksCore::Runner::CommandRunner
      DEFAULT_REFRESH_INTERVAL = 1
      CONNECTION_PROMPT = 'Are you sure you want to continue connecting (yes/no)? '

      def initialize(options, suspended_action:)
        super(options, :suspended_action => suspended_action)
        @playbook_runner = ForemanAnsibleCore::Runner::Playbook.new(
          options['ansible_inventory'],
          options['script'],
          options,
          :suspended_action => suspended_action
        )
      end

      def start
        @playbook_runner.logger = logger
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
        kill if unknown_host_key_fingerprint?
      end

      def kill
        publish_exit_status(1)
        ::Process.kill('SIGTERM', @command_pid)
        close
      end

      private

      def unknown_host_key_fingerprint?
        last_output = @continuous_output.raw_outputs.last
        return if last_output.nil?
        last_output['output']&.lines&.last == CONNECTION_PROMPT
      end
    end
  end
end
