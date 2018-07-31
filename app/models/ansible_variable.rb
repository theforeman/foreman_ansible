# frozen_string_literal: true

# Represents the variables used in Ansible to parameterize playbooks
class AnsibleVariable < LookupKey
  belongs_to :ansible_role, :inverse_of => :ansible_variables
  validates :ansible_role, :presence => true
  scoped_search :on => :key, :aliases => [:name], :complete_value => true
  scoped_search :relation => :ansible_role, :on => :name,
                :complete_value => true, :rename => :ansible_role

  def ansible?
    true
  end

  def self.humanize_class_name
    'Ansible variable'
  end

  def editable_by_user?
    AnsibleVariable.authorized(:edit_external_parameters).
      where(:id => id).exists?
  end
end
