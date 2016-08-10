module ForemanAnsible
  # Sugar-coating so that playing a list of roles is easier and
  # more understandable, it just requires a host and it figures out the rest
  class RolePlayer
    attr_reader :host

    def initialize(host)
      @host = host
    end

    def play
      hosts = Array(@host) unless @host.kind_of? Array
      # TODO: Add action which would divide hosts by proxies and trigger playbook runs as subtasks
      ForemanTasks.async_task(::Actions::Ansible::RunPlaybook, hosts, nil)
    end
  end
end
