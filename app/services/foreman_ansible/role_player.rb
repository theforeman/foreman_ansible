module ForemanAnsible
  # Sugar-coating so that playing a list of roles is easier and
  # more understandable, it just requires a host and it figures out the rest
  class RolePlayer
    attr_reader :host

    def initialize(host)
      @host = host
    end

    def play
      return if host.all_ansible_roles.empty?
      inventory_tempfile = InventoryCreator.new([host]).tempfile
      RunPlaybookJob.new(create_playbook.path,
                         inventory_tempfile.path).enqueue
    end

    private

    def create_playbook
      PlaybookCreator.new(
        host.fqdn,
        host.all_ansible_roles.map(&:name)
      ).roles_tempfile
    end
  end
end
