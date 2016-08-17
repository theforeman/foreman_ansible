# Adds primary key to join table between Hostgroup and Ansible Role
class AddPrimaryKeyHostgroupAnsibleRoles < ActiveRecord::Migration
  def change
    add_column :hostgroup_ansible_roles, :id, :primary_key
  end
end
