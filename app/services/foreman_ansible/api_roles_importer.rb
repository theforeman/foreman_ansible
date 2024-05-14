# frozen_string_literal: true

module ForemanAnsible
  # imports Ansible roles through API
  class ApiRolesImporter < RolesImporter
    include ::ForemanAnsible::AnsibleRolesDataPreparations

    def import!(role_names)
      @roles_importer = ForemanAnsible::UIRolesImporter.new(@ansible_proxy)
      @variables_importer = ForemanAnsible::VariablesImporter.new(@ansible_proxy)
      params = { 'changed' => {} }
      roles = prepare_ansible_import_rows(@roles_importer.import!, @variables_importer, false)
      roles.each do |role|
        if role_names.include? role[:name]
          params['changed'][role[:kind]] ||= {}
          params['changed'][role[:kind]][role[:name]] = { 'id' => role[:id], 'name' => role[:name] }
        end
      end
      params
    end

    def confirm_import(params)
      @roles_importer.finish_import(params['changed'])
      @variables_importer.import_variables_roles(params['changed']) if params['changed']['new'] || params['changed']['old']
    end

    def confirm_sync(params)
      job = SyncRolesAndVariables.perform_later(params['changed'], @ansible_proxy)
      task = ForemanTasks::Task.find_by(external_id: job.provider_job_id)
      task
    end

    def obsolete!
      obsolete_roles = import_role_names[:obsolete]
      obsolete_roles.map(&:destroy)
      obsolete_roles
    end
  end
end
