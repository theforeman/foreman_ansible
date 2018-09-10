# frozen_string_literal: true

# Renames join table between Host and Ansible Roles
class CreateHostAnsibleRoles < ActiveRecord::Migration[4.2]
  def change
    rename_table :ansible_roles_hosts, :host_ansible_roles
    add_column :host_ansible_roles, :id, :primary_key
  end
end
