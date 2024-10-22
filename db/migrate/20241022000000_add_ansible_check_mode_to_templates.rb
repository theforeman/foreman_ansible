# frozen_string_literal: true

class AddAnsibleCheckModeToTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :templates, :ansible_check_mode, :boolean, default: false
    RemoteExecutionFeature.where(label: 'ansible_run_host').each do |rex_feature|
      Template.where(id: rex_feature.job_template_id).update_all(ansible_check_mode: false)
    end
  end
end
