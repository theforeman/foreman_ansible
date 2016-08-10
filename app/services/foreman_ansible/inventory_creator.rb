require 'securerandom'
module ForemanAnsible
  # Service to list an inventory to be passed to the ansible-playbook binary
  class InventoryCreator
    attr_reader :hosts

    def initialize(hosts)
      @hosts = hosts
    end

    # It returns a hash in a format that Ansible understands.
    # See http://docs.ansible.com/ansible/developing_inventory.html
    # for more details.
    # For now, we don't group the hosts based on different paramters
    # (use https://github.com/theforeman/foreman_ansible_inventory for
    # more advanced cases). Therefore we have only the 'all' group
    # with all hosts.
    def to_hash
      { 'all' => { 'hosts' => hosts.map(&:fqdn) },
        '_meta' => { 'hostvars' => host_vars } }
    end

    def host_vars
      hosts.reduce({}) do |hash, host|
        hash.update(host.fqdn =>
                    { 'foreman' => host_attributes(host),
                      'foreman_params' => host_params(host),
                      'foreman_ansible_roles' => host_roles(host) })
      end
    end

    def host_roles(host)
      host.all_ansible_roles.map(&:name)
    end

    def host_attributes(host)
      render_rabl(host, 'api/v2/hosts/main')
    end

    def host_params(host)
      host.host_params
    end

    private

    def render_rabl(host, template)
      Rabl.render(host, template, :format => 'hash')
    end
  end
end
