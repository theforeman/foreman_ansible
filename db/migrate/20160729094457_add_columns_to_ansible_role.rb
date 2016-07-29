# to keep track of when the roles were imported
class AddColumnsToAnsibleRole < ActiveRecord::Migration
  def up
    add_column :ansible_roles, :created_at, :datetime, :default => Time.now
    add_column :ansible_roles, :updated_at, :datetime, :default => Time.now
  end

  def down
    remove_column :ansible_roles, :created_at
    remove_column :ansible_roles, :updated_at
  end
end
