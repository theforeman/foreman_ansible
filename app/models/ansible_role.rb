# Simple model to store basic info about the Ansible role
class AnsibleRole < ActiveRecord::Base
  validates :name, :presence => true, :uniqueness => true
  has_many :host_ansible_roles
  has_many_hosts :through => :host_ansible_roles, :dependent => :destroy
  has_many :hostgroup_ansible_roles
  has_many :hostgroups, :through => :hostgroup_ansible_roles,
                        :dependent => :destroy
end
