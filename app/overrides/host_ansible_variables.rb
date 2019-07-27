# frozen_string_literal: true

# Displays Ansible variables on the Host Parameters tab
Deface::Override.new(
  :virtual_path => 'hosts/_form',
  :name => 'host_ansible_variables',
  :insert_top => 'div.tab-pane#params',
  :partial => 'foreman_ansible/ansible_variables/host_variables'
  )