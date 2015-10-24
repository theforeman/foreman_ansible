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
  end
end
