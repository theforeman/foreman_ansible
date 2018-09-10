# frozen_string_literal: true

# Creation and updates timestamps for Ansible Roles
class AutomaticallySetRoleTimestamps < ActiveRecord::Migration[4.2]
  def up
    change_column :ansible_roles, :created_at, :datetime, :null => true,
                                                          :default => nil
    change_column :ansible_roles, :updated_at, :datetime, :null => true,
                                                          :default => nil
  end

  def down
    change_column :ansible_roles, :created_at, :datetime,
                  :null => false, :default => Time.now.utc
    change_column :ansible_roles, :updated_at, :datetime,
                  :null => false, :default => Time.now.utc
  end
end
