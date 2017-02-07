class CreateRoleFiles < ActiveRecord::Migration
  def up
    create_table :ansible_files do |t|
      t.string :name, :null => false, :limit => 255
      t.string :dir, :null => false, :limit => 255
      t.integer :ansible_role_id
      t.datetime :created_at
      t.datetime :updated_at
    end
    add_index :ansible_files, [:ansible_role_id, :name, :dir], :unique => true
  end

  def down
    drop_table :ansible_files
  end
end
