# frozen_string_literal: true

# Simple model to store basic info about the Ansible role
class AnsibleRole < ApplicationRecord
  audited
  include Authorizable

  self.include_root_in_json = false
  validates :name, :presence => true, :uniqueness => true
  has_many :host_ansible_roles
  has_many_hosts :through => :host_ansible_roles, :dependent => :destroy
  has_many :hostgroup_ansible_roles
  has_many :hostgroups, :through => :hostgroup_ansible_roles,
                        :dependent => :destroy
  has_many :ansible_variables, :inverse_of => :ansible_role,
                               :dependent => :destroy,
                               :class_name => 'AnsibleVariable'

  scoped_search :on => :name, :complete_value => true
  scoped_search :on => :id, :complete_value => false
  scoped_search :on => :updated_at
  scoped_search :relation => :hosts,
                :on => :id, :rename => :host_id, :only_explicit => true
  scoped_search :relation => :hosts,
                :on => :name, :rename => :host, :only_explicit => true
  scoped_search :relation => :hostgroups,
                :on => :id, :rename => :hostgroup_id, :only_explicit => true
  scoped_search :relation => :hostgroups,
                :on => :name, :rename => :hostgroup, :only_explicit => true

  apipie :class, "A class representing #{model_name.human} object" do
    name 'Ansible role'
    refs 'AnsibleRole'
    sections only: %w[all additional]
    property :name, String, desc: 'Returns name of the ansible role'
  end
  # Methods to be allowed in any template with safemode enabled
  class Jail < Safemode::Jail
    allow :name
  end
end
