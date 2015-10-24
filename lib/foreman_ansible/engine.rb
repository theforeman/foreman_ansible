require 'deface'

module ForemanAnsible
  class Engine < ::Rails::Engine
    engine_name 'foreman_ansible'

    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]

    initializer 'foreman_ansible.register_plugin', after: :finisher_hook do |_app|
      Foreman::Plugin.register :foreman_ansible do
        requires_foreman '>= 1.6'
      end
    end

    config.to_prepare do
      begin
      ::FactImporter.register_fact_importer(:foreman_salt, ForemanAnsible::FactImporter)
      rescue => e
        puts "ForemanAnsible: skipping engine hook (#{e.to_s})"
      end
    end
  end
end
