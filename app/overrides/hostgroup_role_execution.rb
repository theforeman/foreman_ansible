# Displays Ansible roles execution buttons in host group action buttons
Deface::Override.new(
  :virtual_path => 'hostgroups/index',
  :name => 'hostgroup_ansible_role_execution',
  :replace => "erb[loud]:contains('action_buttons')",
  :partial => 'foreman_ansible/ansible_roles/hostgroup_ansible_role_execution'
)

Deface::Override.new(
  :virtual_path => 'hostgroups/index',
  :name => 'hostgroup_ansible_role_execution_forms',
  :insert_after => 'table',
  :partial =>
    'foreman_ansible/ansible_roles/hostgroup_ansible_role_execution_forms'
)
