module ImportPlaybooksJob
  module Async
    class SyncPlaybooks < ::Actions::EntryAction
      def plan(proxy, playbooks_names)
        plan_self(proxy: proxy, playbooks_names: playbooks_names)
      end

      def run
        playbooks_importer = ForemanAnsible::PlaybooksImporter.new(proxy)
        output[:result] = playbooks_importer.import_playbooks(playbooks_names)
        ForemanAnsible::ImportPlaybooksSuccessNotification.deliver!(task)
      rescue StandardError => e
        ForemanAnsible::ImportPlaybooksErrorNotification.new(e, task).deliver!
      end

      def proxy
        SmartProxy.find(input[:proxy])
      end

      def playbooks_names
        input[:playbooks_names]
      end
    end
  end
end
