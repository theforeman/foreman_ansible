class AnsibleFile < ActiveRecord::Base
  DIRS = %w(defaults tasks vars meta templates handlers files)
  validates :name, :presence => true, :uniqueness => { :scope => [:dir, :ansible_role] }
  validates :dir, :presence => true, :inclusion => { :in => DIRS }

  scoped_search :on => :name, :complete_value => true
  scoped_search :on => :dir, :complete_value => true
  scoped_search :in => :ansible_role, :on => :name, :complete_value => true, :rename => :ansible_role

  belongs_to :ansible_role

  attr_accessor :content

  def yml?
    name_ext == 'yml' || name_ext == 'yaml'
  end

  def name_ext
    name.split('.').last
  end
end
