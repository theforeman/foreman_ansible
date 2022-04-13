# frozen_string_literal: true

collection @ansible_roles

extends 'api/v2/ansible_roles/show'

node :inherited do |role|
  @inherited_ansible_roles.include?(role)
end
