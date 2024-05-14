class SyncRolesAndVariables < ::ApplicationJob
  queue_as :default

  def perform(changed, proxy)
    roles_importer = ForemanAnsible::UIRolesImporter.new(proxy)
    variables_importer = ForemanAnsible::VariablesImporter.new(proxy)
    roles_importer.finish_import(changed)
    variables_importer.import_variables_roles(changed) if changed['new'] || changed['old']
    task = ForemanTasks::Task.where(:external_id => @provider_job_id)[0]
    ForemanAnsible::ImportRolesAndVariablesSuccessNotification.deliver!(task)
  rescue StandardError => e
    task = ForemanTasks::Task.where(:external_id => @provider_job_id)[0]
    notification = ForemanAnsible::ImportRolesAndVariablesErrorNotification.new(e, task)
    notification.deliver!
  end

  def humanized_name
    _('Import roles And Variables')
  end
end
