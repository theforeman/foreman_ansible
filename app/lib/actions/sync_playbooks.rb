module Actions
  class SyncPlaybooks < ::Actions::EntryAction
    def plan(proxy_id, playbooks_names)
      plan_self(proxy_id: proxy_id, playbooks_names: playbooks_names)
    end

    def run
      playbooks_importer = ForemanAnsible::PlaybooksImporter.new(proxy)
      output[:result] = playbooks_importer.import_playbooks(playbooks_names)
      ForemanAnsible::ImportPlaybooksSuccessNotification.deliver!(task)
    rescue StandardError => e
      ForemanAnsible::ImportPlaybooksErrorNotification.new(e, task).deliver!
    end

    def proxy
      SmartProxy.find(input[:proxy_id])
    end

    def playbooks_names
      input[:playbooks_names]
    end
  end
end
