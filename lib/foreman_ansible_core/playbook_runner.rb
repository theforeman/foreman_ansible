require 'foreman_tasks_core/runner/command_runner'
require_relative 'command_creator'
require 'tmpdir'

module ForemanAnsibleCore
  # Implements ForemanTasksCore::Runner::Base interface for running
  # Ansible playbooks, used by the Foreman Ansible plugin and Ansible proxy
  class PlaybookRunner < ForemanTasksCore::Runner::CommandRunner
    attr_reader :command_out, :command_in, :command_pid

    def initialize(inventory, playbook, options = {})
      super
      @inventory = inventory
      @playbook  = playbook
      @options   = options
      initialize_dirs
    end

    def start
      write_inventory
      write_playbook
      command = CommandCreator.new(inventory_file,
                                   playbook_file,
                                   @options).command
      logger.debug('[foreman_ansible] - Initializing Ansible Runner')
      Dir.chdir(@ansible_dir) do
        initialize_command(*command)
        logger.debug("[foreman_ansible] - Running command #{command}")
      end
    end

    def kill
      publish_data('== TASK ABORTED BY USER ==', 'stdout')
      publish_exit_status(1)
      ::Process.kill('SIGTERM', @command_pid)
      close
    end

    def close
      super
      FileUtils.remove_entry(@working_dir) if @tmp_working_dir
    end

    private

    def write_inventory
      ensure_directory(File.dirname(inventory_file))
      File.write(inventory_file, @inventory)
    end

    def write_playbook
      ensure_directory(File.dirname(playbook_file))
      File.write(playbook_file, @playbook)
    end

    def inventory_file
      File.join(@working_dir, 'foreman-inventories', id)
    end

    def playbook_file
      File.join(@working_dir, "foreman-playbook-#{id}.yml")
    end

    def events_dir
      File.join(@working_dir, 'events', id.to_s)
    end

    def ensure_directory(path)
      if File.exist?(path)
        raise "#{path} expected to be a directory" unless File.directory?(path)
      else
        FileUtils.mkdir_p(path)
      end
      path
    end

    def initialize_dirs
      settings = ForemanAnsibleCore.settings
      initialize_working_dir(settings[:working_dir])
      initialize_ansible_dir(settings[:ansible_dir])
    end

    def initialize_working_dir(working_dir)
      if working_dir.nil?
        @working_dir = Dir.mktmpdir
        @tmp_working_dir = true
      else
        @working_dir = File.expand_path(working_dir)
      end
    end

    def initialize_ansible_dir(ansible_dir)
      raise "Ansible dir #{ansible_dir} does not exist" unless
        !ansible_dir.nil? && File.exist?(ansible_dir)
      @ansible_dir = ansible_dir
    end
  end
end
