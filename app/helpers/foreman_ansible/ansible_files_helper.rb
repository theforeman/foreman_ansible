module ForemanAnsible
  # Helper methods for Ansible files
  module AnsibleFilesHelper
    def form_url(file)
      file.new_record? ? hash_for_ansible_files_path : hash_for_ansible_file_path(:id => file.id)
    end

    def form_cancel_url(file)
      file.new_record? ? hash_for_ansible_roles_path : hash_for_ansible_files_path(:search => files_for_role(file.ansible_role, file.dir))
    end

    def admissible_file_type(file)
      AnsibleFile.where(:ansible_role_id => file.ansible_role_id).select('distinct dir').map(&:dir)
    end
  end
end
