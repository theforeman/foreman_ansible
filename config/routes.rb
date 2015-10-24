Rails.application.routes.draw do
  match 'new_action', to: 'foreman_ansible/hosts#new_action'
end
