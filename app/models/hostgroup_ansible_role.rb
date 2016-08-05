# Join model that hosts the connection between hostgroups and ansible_roles
class HostgroupAnsibleRole < ActiveRecord::Base
  belongs_to :hostgroup
  belongs_to :ansible_role

  validates :ansible_role_id, :presence => true,
                              :uniqueness => { :scope => :hostgroup_id }
end
