# to keep track of when the roles were imported
class AddAnsibleRoleIdToLookupKeys < ActiveRecord::Migration[4.2]
  def up
    add_column :lookup_keys, :ansible_role_id, :integer
    add_index :lookup_keys, :ansible_role_id
  end

  def down
    remove_index :lookup_keys, :ansible_role_id
    remove_column :lookup_keys, :ansible_role_id
  end
end
