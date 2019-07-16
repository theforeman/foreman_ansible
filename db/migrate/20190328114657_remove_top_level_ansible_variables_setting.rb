class RemoveTopLevelAnsibleVariablesSetting < ActiveRecord::Migration[5.2]
  def up
    setting = Setting.find_by(:name => 'top_level_ansible_vars')
    setting&.destroy
  end
end
