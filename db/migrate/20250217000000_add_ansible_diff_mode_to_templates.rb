class AddAnsibleDiffModeToTemplates < ActiveRecord::Migration[7.0]
  def change
    add_column :templates, :ansible_diff_mode, :boolean, default: false
  end
end
