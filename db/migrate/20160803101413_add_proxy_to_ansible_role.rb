class AddProxyToAnsibleRole < ActiveRecord::Migration
  def up
    add_column :ansible_roles, :proxy_id, :integer
  end

  def down
    remove_column :ansible_roles, :proxy_id
  end
end
