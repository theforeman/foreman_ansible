module ForemanAnsibleCore
  # Creates the actual command to be passed to foreman_tasks_core to run
  class CommandCreator
    attr_reader :command

    def initialize(inventory_file, playbook_file, options = {})
      @options = options
      @command = [{ 'JSON_INVENTORY_FILE' => inventory_file }]
      @command << 'ansible-playbook'
      @command = command_options(@command)
      @command << playbook_file
    end

    private

    def command_options(command)
      command.concat(['-i', json_inventory_script])
      command.concat([setup_verbosity]) if verbose?
      command.concat(['-T', @options[:timeout]]) unless @options[:timeout].nil?
      command
    end

    def json_inventory_script
      File.expand_path('../../bin/json_inventory.sh', File.dirname(__FILE__))
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
        verbosity_level.to_i > 0
      # rubocop:enable Rails/Present
    end
  end
end
