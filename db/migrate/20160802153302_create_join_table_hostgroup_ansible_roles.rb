# Defines the relation between Hostgroup and AnsibleRole
class CreateJoinTableHostgroupAnsibleRoles < ActiveRecord::Migration
  def change
    create_join_table :hostgroup, :ansible_roles,
                      :table_name => 'hostgroup_ansible_roles' do |t|
      t.index [:hostgroup_id, :ansible_role_id]
      t.index [:ansible_role_id, :hostgroup_id]
    end
  end
end
