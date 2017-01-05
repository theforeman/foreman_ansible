# Displays Ansible roles button in host group action buttons
Deface::Override.new(
  :virtual_path => 'hostgroups/index',
  :name => 'hostgroup_ansible_roles_button',
  :replace => "erb[loud]:contains('action_buttons')",
  :partial => 'foreman_ansible/ansible_roles/hostgroup_ansible_roles_button'
)
