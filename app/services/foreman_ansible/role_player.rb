module ForemanAnsible
  # Sugar-coating so that playing a list of roles is easier and
  # more understandable, it just requires a host and it figures out the rest
  class RolePlayer
    attr_reader :host

    def initialize(hosts)
      @hosts = [hosts].flatten
    end

    def play
      ForemanTasks.async_task(::Actions::Ansible::PlayRoles, @hosts)
    end
  end
end
