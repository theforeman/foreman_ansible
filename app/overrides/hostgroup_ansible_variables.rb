# frozen_string_literal: true

# Displays Ansible variables on the Hostgroup Parameters tab
Deface::Override.new(
  :virtual_path => 'hostgroups/_form',
  :name => 'hostgroup_ansible_variables',
  :insert_top => 'div.tab-pane#params',
  :partial => 'foreman_ansible/ansible_variables/hostgroup_variables'
)
