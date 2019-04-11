# frozen_string_literal: true

module ForemanAnsibleCore
  # Creates the actual command to be passed to foreman_tasks_core to run
  class CommandCreator
    def initialize(inventory_file, playbook_file, options = {})
      @options = options
      @playbook_file = playbook_file
      @inventory_file = inventory_file
      command
    end

    def command
      parts = [environment_variables]
      parts << 'ansible-playbook'
      parts.concat(command_options)
      parts << @playbook_file
      parts
    end

    private

    def environment_variables
      defaults = { 'JSON_INVENTORY_FILE' => @inventory_file }
      defaults['ANSIBLE_CALLBACK_WHITELIST'] = '' if rex_command?
      defaults
    end

    def command_options
      opts = ['-i', json_inventory_script]
      opts.concat([setup_verbosity]) if verbose?
      opts.concat(['-T', @options[:timeout]]) unless @options[:timeout].nil?
      opts
    end

    def json_inventory_script
      File.expand_path('../../../bin/json_inventory.sh', File.dirname(__FILE__))
    end

    def setup_verbosity
      verbosity_level = @options[:verbosity_level].to_i
      verbosity = '-'
      verbosity_level.times do
        verbosity += 'v'
      end
      verbosity
    end

    def verbose?
      verbosity_level = @options[:verbosity_level]
      # rubocop:disable Rails/Present
      !verbosity_level.nil? && !verbosity_level.empty? &&
        verbosity_level.to_i.positive?
      # rubocop:enable Rails/Present
    end

    def rex_command?
      @options[:remote_execution_command]
    end
  end
end
