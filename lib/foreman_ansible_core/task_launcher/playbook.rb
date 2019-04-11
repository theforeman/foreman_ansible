module ForemanAnsibleCore
  module TaskLauncher
    class Playbook < ForemanTasksCore::TaskLauncher::Batch
      class PlaybookRunnerAction < ForemanTasksCore::Runner::Action
        def initiate_runner
          additional_options = {
            :step_id => run_step_id,
            :uuid => execution_plan_id
          }
          ::ForemanAnsibleCore::RemoteExecutionCore::AnsibleRunner.new(
            input.merge(additional_options),
            :suspended_action => suspended_action
          )
        end
      end

      def child_launcher(parent)
        ForemanTasksCore::TaskLauncher::Single.new(world, callback, :parent => parent,
                                                                    :action_class_override => PlaybookRunnerAction)
      end
    end
  end
end
