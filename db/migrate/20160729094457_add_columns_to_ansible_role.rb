# frozen_string_literal: true

# to keep track of when the roles were imported
class AddColumnsToAnsibleRole < ActiveRecord::Migration[4.2]
  def up
    add_column :ansible_roles, :created_at, :datetime, :default => Time.now.utc
    add_column :ansible_roles, :updated_at, :datetime, :default => Time.now.utc
  end

  def down
    remove_column :ansible_roles, :created_at
    remove_column :ansible_roles, :updated_at
  end
end
