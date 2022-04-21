# frozen_string_literal: true

require 'deface'
require 'acts_as_list'
require 'fast_gettext'
require 'gettext_i18n_rails'
require 'foreman_ansible/remote_execution'

module ForemanAnsible
  # This engine connects ForemanAnsible with Foreman core
  class Engine < ::Rails::Engine
    engine_name 'foreman_ansible'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models"]
    config.autoload_paths += Dir["#{config.root}/app/helpers"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]
    config.autoload_paths += Dir["#{config.root}/app/views"]
    config.autoload_paths += Dir["#{config.root}/app/lib"]

    initializer 'foreman_ansible.register_gettext',
                :after => :load_config_initializers do
      locale_dir = File.join(File.expand_path('../..', __dir__), 'locale')
      locale_domain = 'foreman_ansible'

      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end

    initializer 'foreman_ansible.register_plugin', :before => :finisher_hook do
      require 'foreman_ansible/register'
    end

    initializer('foreman_ansible.require_dynflow',
                :before => 'foreman_tasks.initialize_dynflow') do
      ::ForemanTasks.dynflow.require!
      actions_path = File.join(ForemanAnsible::Engine.root, 'app/lib/actions')
      ::ForemanTasks.dynflow.config.eager_load_paths << actions_path
    end

    # Add any db migrations
    initializer 'foreman_ansible.load_app_instance_data' do |app|
      ForemanAnsible::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_ansible.assets.precompile' do |app|
      app.config.assets.precompile += %w[foreman_ansible/Ansible.png]
    end

    initializer 'foreman_ansible.configure_assets', :group => :assets do
      SETTINGS[:foreman_ansible] = {
        :assets => {
          :precompile => ['foreman_ansible/Ansible.png',
                          'foreman_ansible/foreman-ansible.css']
        }
      }
    end

    initializer 'foreman_ansible.apipie' do
      Apipie.configuration.api_controllers_matcher <<
        "#{ForemanAnsible::Engine.root}/app/controllers/api/v2/*.rb"
      Apipie.configuration.checksum_path += ['/foreman_ansible/api/']
    end

    config.to_prepare do
      ::Host::Managed.prepend ForemanAnsible::HostManagedExtensions
      ::Hostgroup.include ForemanAnsible::HostgroupExtensions
      ::HostsController.include ForemanAnsible::Concerns::HostsControllerExtensions
      ::Api::V2::HostsController.include ForemanAnsible::Api::V2::HostsControllerExtensions
      ::Api::V2::HostsController.include ForemanAnsible::Api::V2::HostsParamGroupExtensions
      ::HostgroupsController.include ForemanAnsible::Concerns::HostgroupsControllerExtensions
      ::Api::V2::HostgroupsController.include ForemanAnsible::Api::V2::HostgroupsControllerExtensions
      ::Api::V2::HostgroupsController.include ForemanAnsible::Api::V2::HostgroupsParamGroupExtensions
      ::ConfigReportImporter.include ForemanAnsible::AnsibleReportImporter
      ReportImporter.register_smart_proxy_feature('Ansible')
    rescue StandardError => e
      Rails.logger.warn "Foreman Ansible: skipping engine hook (#{e})"
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        ForemanAnsible::Engine.load_seed
      end
    end
  end
end
