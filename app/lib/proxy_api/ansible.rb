# frozen_string_literal: true

module ProxyAPI
  # ProxyAPI for Ansible
  class Ansible < ::ProxyAPI::Resource
    def initialize(args)
      @url = args[:url] + '/ansible/'
      super args
    end

    PROXY_ERRORS = [
      Errno::ECONNREFUSED,
      SocketError,
      Timeout::Error,
      Errno::EINVAL,
      Errno::ECONNRESET,
      EOFError,
      Net::HTTPBadResponse,
      Net::HTTPHeaderSyntaxError,
      Net::ProtocolError,
      RestClient::ResourceNotFound
    ].freeze

    def roles
      parse(get('roles'))
    rescue *PROXY_ERRORS => e
      raise ProxyException.new(url, e, N_('Unable to get roles from Ansible'))
    end

    def all_variables
      parse(get('roles/variables'))
    rescue *PROXY_ERRORS => e
      raise ProxyException.new(url, e,
                               N_('Unable to get roles/variables from Ansible'))
    end

    def variables(role)
      parse(get("roles/#{role}/variables"))
    rescue *PROXY_ERRORS => e
      raise ProxyException.new(url, e,
                               N_('Unable to get roles/variables from Ansible'))
    end

    def playbooks_names
      parse(get('playbooks_names'))
    rescue *PROXY_ERRORS => e
      raise ProxyException.new(url, e, N_('Unable to get playbook\'s names from Ansible'))
    end

    def playbooks(playbooks_names = [])
      playbooks_names = playbooks_names.join(',')
      parse(get("playbooks/#{playbooks_names}"))
    rescue *PROXY_ERRORS => e
      raise ProxyException.new(url, e, N_('Unable to get playbooks from Ansible'))
    end
  end
end
