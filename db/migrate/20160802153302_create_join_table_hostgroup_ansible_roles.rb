# frozen_string_literal: true

# Defines the relation between Hostgroup and AnsibleRole
class CreateJoinTableHostgroupAnsibleRoles < ActiveRecord::Migration[4.2]
  def change
    create_join_table :hostgroup, :ansible_roles, :table_name => 'hostgroup_ansible_roles' do |t|
      t.index [:hostgroup_id, :ansible_role_id], :name => 'index_ansible_roles_hostgroup_on_hostgroup_id_and_role_id'
      t.index [:ansible_role_id, :hostgroup_id], :name => 'index_ansible_roles_hostgroup_on_role_id_and_hostgroup_id'
    end
  end
end
