class UpdateAnsibleInvTemplateName < ActiveRecord::Migration[5.2]
  def up
    Setting.where(:name => 'ansible_inventory_template').update_all(:default => 'Ansible - Ansible Inventory')
  end
  
  def down
    Setting.where(:name => 'ansible_inventory_template').update_all(:default => 'Ansible Inventory')
  end
end
