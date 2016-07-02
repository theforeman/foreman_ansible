# Join model that hosts the connection between hosts and ansible_roles
class HostAnsibleRole < ActiveRecord::Base
  audited :associated_with => :host, :allow_mass_assignment => true
  attr_accessible :host_id, :host, :ansible_role_id, :ansible_role

  belongs_to_host
  belongs_to :ansible_role

  validates :ansible_role_id, :presence => true,
                              :uniqueness => { :scope => :host_id }
end
