# frozen_string_literal: true

# Join model that hosts the connection between hosts and ansible_roles
class HostAnsibleRole < ApplicationRecord
  belongs_to_host
  belongs_to :ansible_role
  acts_as_list scope: :host

  validates :ansible_role_id, :presence => true,
                              :uniqueness => { :scope => :host_id }
end
