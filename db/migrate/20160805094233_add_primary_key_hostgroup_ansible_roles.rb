class AddPrimaryKeyHostgroupAnsibleRoles < ActiveRecord::Migration
  def change
    add_column :hostgroup_ansible_roles, :id, :primary_key
  end
end
