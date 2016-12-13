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
        '_meta' => { 'hostvars' => hosts_vars } }
    end

    def hosts_vars
      hosts.reduce({}) do |hash, host|
        hash.update(host.fqdn => host_vars(host))
      end
    end

    def host_vars(host)
      {
        'foreman' => host_attributes(host),
        'foreman_params' => host_params(host),
        'foreman_ansible_roles' => host_roles(host)
      }.merge(connection_params(host))
    end

    def connection_params(host)
      params = {
        'ansible_port' => host_port(host),
        'ansible_user' => host_user(host),
        'ansible_ssh_pass' => host_ssh_pass(host),
        'ansible_connection' => connection_type(host),
        'ansible_winrm_server_cert_validation' => winrm_cert_validation(host)
      }
      # Backward compatibility for Ansible 1.x
      params['ansible_ssh_port'] = params['ansible_port']
      params['ansible_ssh_user'] = params['ansible_user']
      params
    end

    def winrm_cert_validation(host)
      host.host_params['ansible_winrm_server_cert_validation'] ||
        Setting['ansible_winrm_server_cert_validation']
    end

    def connection_type(host)
      host.host_params['ansible_connection'] || Setting['ansible_connection']
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

    def host_port(host)
      host.host_params['ansible_port'] || Setting[:ansible_port]
    end

    def host_user(host)
      host.host_params['ansible_user'] || Setting[:ansible_user]
    end

    def host_ssh_pass(host)
      host.host_params['ansible_ssh_pass'] || Setting[:ansible_ssh_pass]
    end

    private

    def render_rabl(host, template)
      Rabl.render(host, template, :format => 'hash')
    end
  end
end
