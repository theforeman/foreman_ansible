# frozen_string_literal: true

require 'securerandom'
module ForemanAnsible
  # Service to list an inventory to be passed to the ansible-playbook binary
  class InventoryCreator
    attr_reader :hosts

    def initialize(hosts, template_invocation)
      @hosts = hosts
      @template_invocation = template_invocation
    end

    # It returns a hash in a format that Ansible understands.
    # See http://docs.ansible.com/ansible/developing_inventory.html
    # for more details.
    # For now, we don't group the hosts based on different paramters
    # (use https://github.com/theforeman/foreman_ansible_inventory for
    # more advanced cases). Therefore we have only the 'all' group
    # with all hosts.
    def to_hash
      hosts = @hosts.map do |h|
        RemoteExecutionProvider.find_ip_or_hostname(h)
      end

      { 'all' => { 'hosts' => hosts,
                   'vars'  => template_inputs(@template_invocation) },
        '_meta' => { 'hostvars' => hosts_vars } }
    end

    def hosts_vars
      hosts.reduce({}) do |hash, host|
        hash.update(
          RemoteExecutionProvider.find_ip_or_hostname(host) => host_vars(host)
        )
      end
    end

    def host_vars(host)
      result = {
        'foreman' => host_attributes(host),
        'foreman_params' => host_params(host),
        'foreman_ansible_roles' => host_roles(host)
      }.merge(connection_params(host))
      if Setting['top_level_ansible_vars']
        result = result.merge(host_params(host))
      end
      result
    end

    def connection_params(host)
      # Preference order is:
      # 1st option: host parameters.
      #   - If they're set to 'ansible_whatever' we use that over anything else
      # 2nd option: REX options.
      #   - both settings, ssh password, effective_user can be used
      # 3rd option:
      #   - other settings
      params = ansible_settings.
               merge(remote_execution_options(host)).
               merge(ansible_extra_options(host))
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
        %w[connection ssh_private_key_file
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

    def remote_execution_options(host)
      params = {
        'ansible_become' => @template_invocation.effective_user,
        'ansible_user' => host_setting(host, 'remote_execution_ssh_user'),
        'ansible_ssh_pass' => rex_ssh_password(host),
        'ansible_ssh_private_key_file' => ansible_or_rex_ssh_private_key(host),
        'ansible_port' => host_setting(host, 'remote_execution_ssh_port')
      }
      # Backward compatibility for Ansible 1.x
      params['ansible_ssh_port'] = params['ansible_port']
      params['ansible_ssh_user'] = params['ansible_user']
      params
    end

    def template_inputs(template_invocation)
      input_values = template_invocation.input_values
      result = input_values.each_with_object({}) do |input, vars_hash|
        vars_hash[input.template_input.name] = input.value
      end
      result
    end

    def rex_ssh_password(host)
      @template_invocation.job_invocation.password ||
        host_setting(host, 'remote_execution_ssh_password')
    end

    def ansible_or_rex_ssh_private_key(host)
      ansible_private_file = host_setting(host, 'ansible_ssh_private_key_file')
      if !ansible_private_file.empty?
        ansible_private_file
      else
        ForemanRemoteExecutionCore.settings[:ssh_identity_key_file]
      end
    end

    private

    def render_rabl(host, template)
      Rabl.render(host, template, :format => 'hash')
    end

    def host_setting(host, setting)
      host.params[setting.to_s] || Setting[setting]
    end
  end
end
