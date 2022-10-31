class RenameCapsuleUpgradePlaybook < ActiveRecord::Migration[6.0]
  MAPPING = {
    'Capsule Upgrade Playbook' => 'Smart Proxy Upgrade Playbook'
  }.freeze

  def up
    rename(MAPPING)
  end

  def down
    rename(MAPPING.invert)
  end

  private

  def rename(mapping)
    mapping.each do |old, new|
      Template.where(name: old).update_all(name: new)
    end
  end
end
