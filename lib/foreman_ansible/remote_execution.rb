if defined? ForemanRemoteExecution
  module ForemanAnsible
    # Dependencies related with the remote execution plugin
    class Engine < ::Rails::Engine
      initializer 'foreman_ansible.load_app_instance_data' do |app|
        ForemanAnsible::Engine.paths['db/migrate'].existent.each do |path|
          app.config.paths['db/migrate'] << path
        end
      end

      config.to_prepare do
        RemoteExecutionProvider.register(:Ansible,
                                         ForemanAnsible::AnsibleProvider)
      end
    end
  end
end
