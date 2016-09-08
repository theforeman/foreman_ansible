module ForemanAnsible
  # imports content of Ansible roles
  class FilesImporter < AnsibleImporter
    attr_reader :roles_path, :source

    def import(ansible_file)
      file_content = source.file(*file_to_args(ansible_file))
      ansible_file.content = file_content['content']
      ansible_file
    end

    def update_file(ansible_file)
      source.update_file(*file_to_args(ansible_file), ansible_file.content)
    end

    def delete_file(ansible_file)
      source.delete_file(*file_to_args(ansible_file))
    end

    def create_file(ansible_file)
      source.create_file(*file_to_args(ansible_file), ansible_file.content)
    end

    def file_to_args(ansible_file)
      [ansible_file.ansible_role.name, ansible_file.dir, ansible_file.name]
    end
  end
end
