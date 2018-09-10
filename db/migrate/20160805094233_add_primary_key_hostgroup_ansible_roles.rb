# frozen_string_literal: true

# Adds primary key to join table between Hostgroup and Ansible Role
class AddPrimaryKeyHostgroupAnsibleRoles < ActiveRecord::Migration[4.2]
  def change
    add_column :hostgroup_ansible_roles, :id, :primary_key
  end
end
