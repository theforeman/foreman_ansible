class AddImportedAttrToAnsibleVariables < ActiveRecord::Migration[5.2]
  def up
    add_column :lookup_keys, :imported, :boolean

    AnsibleVariable.find_in_batches do |batch|
      batch.map do |variable|
        variable.update_attribute :imported, true
      end
    end
  end

  def down
    remove_column :lookup_keys, :imported
  end
end
