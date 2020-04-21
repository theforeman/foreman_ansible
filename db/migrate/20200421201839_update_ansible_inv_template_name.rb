class UpdateAnsibleInvTemplateName < ActiveRecord::Migration[5.2]
  def up
    setting = Setting.find_by(:name => 'ansible_inventory_template')
    setting.update(:default => 'Ansible - Ansible Inventory')
    return unless setting.value == 'Ansible Inventory'

    setting.update(:value => 'Ansible - Ansible Inventory')
  end
end
