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
      { 'all' => { 'hosts' => hosts.map { |h| RemoteExecutionProvider.find_ip_or_hostname(h) } },
        '_meta' => { 'hostvars' => hosts_vars } }
    end

    def hosts_vars
      hosts.reduce({}) do |hash, host|
        hash.update(RemoteExecutionProvider.find_ip_or_hostname(host) => host_vars(host))
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
      params = ansible_settings.merge ansible_extra_options(host)
      # Backward compatibility for Ansible 1.x
      params['ansible_ssh_port'] = params['ansible_port']
      params['ansible_ssh_user'] = params['ansible_user']
      params
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

    def ansible_settings
      Hash[
        %w[port user ssh_pass connection
           ssh_private_key_file become
           winrm_server_cert_validation].map do |setting|
          ["ansible_#{setting}", Setting["ansible_#{setting}"]]
        end
      ]
    end

    def ansible_extra_options(host)
      host.host_params.select do |key, _|
        /ansible_/.match(key) || Setting[key]
      end
    end

    private

    def render_rabl(host, template)
      Rabl.render(host, template, :format => 'hash')
    end
  end
end
