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

    def file(role_name, dir, file_name)
      parse(get "/file/#{role_name}/#{dir}/#{file_name}")
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to get file.'))
    end

    def update_file(role_name, dir, file_name, content)
      parse(post content, "/file/#{role_name}/#{dir}/#{file_name}")
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to update file'))
    end

    def delete_file(role_name, dir, file_name)
      parse(delete "/file/#{role_name}/#{dir}/#{file_name}")
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to delete file'))
    end

    def create_file(role_name, dir, file_name, content)
      parse(put content, "/file/#{role_name}/#{dir}/#{file_name}")
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to delete file'))
    end
  end
end
