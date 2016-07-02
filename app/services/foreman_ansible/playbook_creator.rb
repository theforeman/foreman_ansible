module ForemanAnsible
  # Service to generate a playbook given roles and a list of hosts
  class PlaybookCreator
    attr_reader :fqdn, :role_names

    def initialize(fqdn, role_names)
      @fqdn = fqdn
      @role_names = role_names
    end

    def roles_playbook
      playbook = ['hosts' => fqdn, 'roles' => role_names]
      playbook.to_yaml
    end

    def roles_tempfile
      tempfile = Tempfile.new("foreman-ansible-#{fqdn}-roles")
      tempfile.write(roles_playbook)
      tempfile.close
      tempfile
    end
  end
end
