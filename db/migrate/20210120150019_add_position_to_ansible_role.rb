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
    HostAnsibleRole.all.pluck(:host_id, :id, :ansible_role_id).group_by(&:first).each do |_host_id, role_ids|
      role_ids.each_with_index do |(host_id, host_role_id, ansible_role_id), idx|
        har = HostAnsibleRole.find(host_role_id)
        unless har.update(position: idx + 1) do
          say "Failed to update order for Ansible role ID #{ansible_role_id} and host ID #{host_id}, association ID #{host_role_id}"
          say har.errors.full_messages
        end
      end
    end
  end

  def update_hostgroup_ansible_roles
    HostgroupAnsibleRole.all.pluck(:hostgroup_id, :id, :ansible_role_id).group_by(&:first).each do |_hostgroup_id, role_ids|
      role_ids.each_with_index do |(hostgroup_id, hostgroup_role_id, ansible_role_id), idx|
        har = HostgroupAnsibleRole.find(hostgroup_role_id)
        unless har.update(position: idx + 1) do
          say "Failed to update order for Ansible role ID #{ansible_role_id} and hostgroup ID #{hostgroup_id}, association ID #{hostgroup_role_id}"
          say har.errors.full_messages
        end
      end
    end
  end
end
