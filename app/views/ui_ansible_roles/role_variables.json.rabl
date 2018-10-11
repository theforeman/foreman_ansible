object @ansible_role

extends "api/v2/ansible_roles/show"

node :ansible_variables do |ansible_role|
  partial("ui_ansible_variables/index",
          :object => ansible_role.ansible_variables.where(:lookup_keys => { :override => true }),
          :locals => { :override_resolver => @override_resolver }
  )
end
