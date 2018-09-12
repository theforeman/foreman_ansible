# frozen_string_literal: true

# Creates simple model of Ansible Role
class CreateAnsibleRole < ActiveRecord::Migration[4.2]
  def change
    create_table :ansible_roles do |t|
      t.string :name, :null => false, :limit => 255, :unique => true
    end
  end
end
