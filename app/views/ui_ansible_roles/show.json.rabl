object @ansible_role

attributes :id, :name, :updated_at
code :hostgroups_count do |role|
  role.hostgroups.count
end
code :hosts_count do |role|
  role.hosts.count
end
code :variables_count do |role|
  role.ansible_variables.count
end
code :can_delete do
  User.current.can?(:destroy_ansible_roles)
end
