require 'deface'
module ForemanAnsible
  # This engine connects ForemanAnsible with Foreman core
  class Engine < ::Rails::Engine
    engine_name 'foreman_ansible'

    config.autoload_paths += Dir["#{config.root}/app/helpers"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]
    config.autoload_paths += Dir["#{config.root}/app/views"]

    initializer 'foreman_ansible.register_plugin', :before => :finisher_hook do
      Foreman::Plugin.register :foreman_ansible do
        requires_foreman '>= 1.9'
      end
    end

    # Add any db migrations
    initializer 'foreman_remote_execution.load_app_instance_data' do |app|
      ForemanAnsible::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    config.to_prepare do
      begin
        ::FactImporter.register_fact_importer(:ansible,
                                              ForemanAnsible::FactImporter)
        ::FactParser.register_fact_parser(:ansible, ForemanAnsible::FactParser)
      rescue => e
        Rails.logger "Foreman Ansible: skipping engine hook (#{e})"
      end
    end
  end
end
