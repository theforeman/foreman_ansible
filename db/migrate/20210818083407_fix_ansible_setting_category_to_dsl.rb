class FixAnsibleSettingCategoryToDsl < ActiveRecord::Migration[6.0]
  def up
    Setting.where(category: 'Setting::Ansible').update_all(category: 'Setting') if column_exists?(:settings, :category)
  end
end
