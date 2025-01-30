class AddAnsibleCheckModeToTemplates < ActiveRecord::Migration[7.0]
  def change
    add_column :templates, :ansible_check_mode, :boolean, default: false
  end
end
