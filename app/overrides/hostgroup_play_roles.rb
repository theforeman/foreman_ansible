# Displays Ansible roles tab on Hostgroup form
Deface::Override.new(
  :virtual_path => 'hostgroups/index',
  :name => 'ansible_row_title',
  :insert_after => "erb[loud]:contains('Actions')",
  :partial => 'foreman_ansible/ansible_roles/ansible_row_title',
  :original => '016f2f86bd199275e7f3bebef77fefa90dd218f1'
)

Deface::Override.new(
  :virtual_path => 'hostgroups/index',
  :name => 'ansible_row_button',
  :insert_after => "erb[loud]:contains('action_buttons')",
  :partial => 'foreman_ansible/ansible_roles/ansible_row_buttons',
  :original => '0605780e50d274f5234320978400796c9a80de33'
)
