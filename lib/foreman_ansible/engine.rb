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

    initializer 'foreman_ansible.register_plugin', :before => :finisher_hook do |app|
      app.reloader.to_prepare do
        require 'foreman_ansible/register'
      end
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
      ::Api::V2::JobTemplatesController.include ForemanAnsible::Api::V2::JobTemplatesControllerExtensions
      ::Api::V2::JobTemplatesController.include Foreman::Controller::Parameters::JobTemplateExtensions
      ::JobTemplatesController.include Foreman::Controller::Parameters::JobTemplateExtensions
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
