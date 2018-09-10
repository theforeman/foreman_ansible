# frozen_string_literal: true

# Displays Ansible roles tab on Hostgroup form
Deface::Override.new(
  :virtual_path => 'hostgroups/_form',
  :name => 'hostgroup_ansible_roles_tab',
  :insert_after => 'li.active',
  :partial => 'foreman_ansible/ansible_roles/select_tab_title'
)

Deface::Override.new(
  :virtual_path => 'hostgroups/_form',
  :name => 'hostgroup_ansible_roles_tab_content',
  :insert_after => 'div.tab-pane.active',
  :partial => 'foreman_ansible/ansible_roles/select_tab_content'
)
