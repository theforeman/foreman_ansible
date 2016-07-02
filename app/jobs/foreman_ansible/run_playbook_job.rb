module ForemanAnsible
  # Run the ansible-playbook binary, depends on a valid playbook and inventory
  class RunPlaybookJob < ActiveJob::Base
    queue_as :ansible
    attr_reader :pid

    after_perform do |job|
      Foreman::Logging.
        logger('foreman_ansible').
        info('PID for playbook run for'\
             " #{job.arguments.first} #{job.arguments.second}:"\
             " #{pid}")
    end

    def perform(playbook_path, inventory_path)
      @pid = spawn("ansible-playbook -i #{inventory_path} #{playbook_path}",
                   :out => log_file,
                   :err => log_file)
    end

    private

    def log_file
      "#{::Foreman::Logging.log_directory}/"\
        "#{::Foreman::Logging.config[:filename]}"
    end
  end
end
