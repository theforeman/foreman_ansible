class RemoveAnsibleImplementationSetting < ActiveRecord::Migration[5.2]
  def up
    Setting.where(:name => 'ansible_implementation').destroy_all
  end
end
