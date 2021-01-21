class AddPositionToAnsibleRole < ActiveRecord::Migration[6.0]
  def change
    add_column :host_ansible_roles, :position, :integer
    add_column :hostgroup_ansible_roles, :position, :integer

    update_hostgroup_ansible_roles
    update_host_ansible_roles
    change_column_null :host_ansible_roles, :position, false
    change_column_null :hostgroup_ansible_roles, :position, false
  end

  def update_host_ansible_roles
    HostAnsibleRole.all.pluck(:host_id, :id).group_by(&:first).each do |_host_id, role_ids|
      role_ids.each_with_index do |(_host_id, host_role_id), idx|
        HostAnsibleRole.find(host_role_id).update(position: idx + 1)
      end
    end
  end

  def update_hostgroup_ansible_roles
    HostgroupAnsibleRole.all.pluck(:hostgroup_id, :id).group_by(&:first).each do |_hostgroup_id, role_ids|
      role_ids.each_with_index do |(_hostgroup_id, hostgroup_role_id), idx|
        HostgroupAnsibleRole.find(hostgroup_role_id).update(position: idx + 1)
      end
    end
  end
end
