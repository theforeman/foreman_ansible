require 'securerandom'
module ForemanAnsible
  # Service to list an inventory to be passed to the ansible-playbook binary
  class InventoryCreator
    attr_reader :hosts

    def initialize(hosts)
      @hosts = hosts
    end

    def tempfile
      tempfile = Tempfile.new("foreman-#{SecureRandom.uuid}-inventory")
      tempfile.write(hosts.map(&:fqdn).join('\n'))
      tempfile.close
      tempfile
    end
  end
end
