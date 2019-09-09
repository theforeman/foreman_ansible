# frozen_string_literal: true

# Represents the variables used in Ansible to parameterize playbooks
class AnsibleVariable < LookupKey
  belongs_to :ansible_role, :inverse_of => :ansible_variables
  validates :ansible_role_id, :presence => true
  before_validation :cast_default_value, :if => :override?
  validates :key, :uniqueness => { :scope => :ansible_role_id }
  scoped_search :on => :key, :aliases => [:name], :complete_value => true
  scoped_search :on => :imported, :complete_value => { :true => true, :false => false }
  scoped_search :relation => :ansible_role, :on => :name,
                :complete_value => true, :rename => :ansible_role

  def ansible?
    true
  end

  def self.humanize_class_name(options = nil)
    if options.present?
      super
    else
      "Ansible variable"
    end
  end

  def editable_by_user?
    AnsibleVariable.authorized(:edit_external_parameters).
      where(:id => id).exists?
  end
end
