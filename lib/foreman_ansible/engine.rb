require 'deface'

module ForemanAnsible
  class Engine < ::Rails::Engine
    engine_name 'foreman_ansible'

    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]

    initializer 'foreman_ansible.register_plugin', :after => :finisher_hook do
      Foreman::Plugin.register :foreman_ansible do
        requires_foreman '>= 1.6'
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
