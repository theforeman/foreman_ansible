# frozen_string_literal: true

module ProxyAPI
  # ProxyAPI for Ansible
  class Ansible < ::ProxyAPI::Resource
    def initialize(args)
      @url = "#{args[:url]}/ansible/"
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

    def repo_information(vcs_url)
      parse(get("vcs_clone/repo_information?vcs_url=#{vcs_url}"))
    rescue *PROXY_ERRORS, RestClient::Exception => e
      raise e unless e.is_a? RestClient::RequestFailed
      case e.http_code
      when 400
        raise Foreman::Exception.new N_('Error requesting repository metadata. Check Smart Proxy log.')
      else
        raise
      end
    end

    def list_installed
      parse(get('vcs_clone/roles'))
    rescue *PROXY_ERRORS
      raise Foreman::Exception.new N_('Error requesting installed roles. Check log.')
    end

    def install_role(repo_info)
      parse(post(repo_info, 'vcs_clone/roles'))
    rescue *PROXY_ERRORS, RestClient::Exception => e
      raise e unless e.is_a? RestClient::RequestFailed
      case e.http_code
      when 409
        raise Foreman::Exception.new N_('A repo with the name %s already exists.') % repo_info['repo_info']&.[]('name')
      when 400
        raise Foreman::Exception.new N_('Git Error. Check log.')
      else
        raise
      end
    end

    def update_role(repo_info)
      name = repo_info.delete('name')
      parse(put(repo_info, "vcs_clone/roles/#{name}"))
    rescue *PROXY_ERRORS, RestClient::Exception => e
      raise e unless e.is_a? RestClient::RequestFailed
      case e.http_code
      when 400
        raise Foreman::Exception.new N_('Error updating %s. Check Smartproxy log.') % name
      else
        raise
      end
    end

    def delete_role(role_name)
      parse(delete("vcs_clone/roles/#{role_name}"))
    rescue *PROXY_ERRORS, RestClient::Exception => e
      raise e unless e.is_a? RestClient::RequestFailed
      case e.http_code
      when 400
        raise Foreman::Exception.new N_('Error deleting %s. Check Smartproxy log.') % role_name
      else
        raise
      end
    end
  end
end
