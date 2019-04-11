require 'fileutils'

module ForemanAnsibleCore
  module TaskLauncher
    class AnsibleRunner < ForemanTasksCore::TaskLauncher::AbstractGroup
      def runner_input(input)
        super(input).reduce({}) do |acc, (_id, data)|
          acc.merge(data[:input]['action_input']['name'] => data)
        end
      end

      def operation
        'ansible-runner'
      end

      def self.runner_class
        Runner::AnsibleRunner
      end

      # def self.input_format
      #   {
      #     $UUID => {
      #       :execution_plan_id => $EXECUTION_PLAN_UUID,
      #       :run_step_id => Integer,
      #       :input => {
      #         :action_class => Class,
      #         :action_input => {
      #           "ansible_inventory"=> String,
      #           "hostname"=>"127.0.0.1",
      #           "script"=>"---\n- hosts: all\n  tasks:\n    - shell: |\n        true\n      register: out\n    - debug: var=out"
      #         }
      #       }
      #     }
      #   }
      # end
    end
  end
end
