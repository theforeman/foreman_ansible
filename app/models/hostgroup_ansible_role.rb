# frozen_string_literal: true

# Join model that hosts the connection between hostgroups and ansible_roles
class HostgroupAnsibleRole < ApplicationRecord
  belongs_to :hostgroup
  belongs_to :ansible_role
  acts_as_list scope: :hostgroup

  validates :ansible_role_id, :presence => true,
                              :uniqueness => { :scope => :hostgroup_id }
end
