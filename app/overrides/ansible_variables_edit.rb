Deface::Override.new(
  :virtual_path => 'lookup_keys/_fields',
  :name => 'ansible_variables_edit',
  :replace => "erb[loud]:contains('show_puppet_class')",
  :partial => 'ansible_variables/ansible_roles_list'
)

Deface::Override.new(
  :virtual_path => 'lookup_keys/_fields',
  :name => 'ansible_variables_validator_text',
  :replace => '.out.collapse > h6',
  :partial => 'ansible_variables/validator_text'
)
