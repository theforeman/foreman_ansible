module ForemanAnsibleCore
  module RemoteExecutionCore
    # Ensure the Ansible provider is used whenever a JobTemplate using this
    # provider is called.
    module SettingsOverride
      def initiate_runner
        return super unless input['ansible_inventory']
        additional_options = {
          :step_id => run_step_id,
          :uuid => execution_plan_id
        }
        ::ForemanAnsibleCore::RemoteExecutionCore::AnsibleRunner.new(
          input.merge(additional_options)
        )
      end
    end
  end
end
