# frozen_string_literal: true

module ForemanAnsible
  # Service to generate a playbook given roles and a list of hosts
  class PlaybookCreator
    attr_reader :role_names

    def initialize(role_names)
      @role_names = role_names
    end

    def roles_playbook
      playbook = ['hosts' => 'all', 'roles' => role_names]
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
