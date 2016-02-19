if defined? ForemanRemoteExecution
  module ForemanAnsible
    # Dependencies related with the remote execution plugin
    class Engine < ::Rails::Engine
      config.to_prepare do
        RemoteExecutionProvider.register(:Ansible,
                                         ForemanAnsible::AnsibleProvider)
      end
    end
  end
end
