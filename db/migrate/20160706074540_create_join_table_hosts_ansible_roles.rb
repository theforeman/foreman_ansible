class CreateJoinTableHostsAnsibleRoles < ActiveRecord::Migration
  def change
    create_join_table :ansible_roles, :hosts do |t|
      t.index [:host_id, :ansible_role_id]
      t.index [:ansible_role_id, :host_id]
    end
  end
end
