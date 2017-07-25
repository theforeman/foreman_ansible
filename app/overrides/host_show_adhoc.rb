Deface::Override.new(
  :virtual_path => 'hosts/show',
  :name => 'host_ansible_ad_hoc_role',
  :insert_after => 'div#processing_message',
  :partial => 'foreman_ansible/ansible_roles/host_ad_hoc_role_modal'
)
