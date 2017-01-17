require 'deface'
require 'fast_gettext'
require 'gettext_i18n_rails'
require 'foreman_ansible_core'

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

    initializer 'foreman_ansible.load_default_settings',
                :before => :load_config_initializers do
      require_dependency(File.join(ForemanAnsible::Engine.root,
                                   'app/models/setting/ansible.rb'))
    end

    initializer 'foreman_ansible.register_gettext',
                :after => :load_config_initializers do
      locale_dir = File.join(File.expand_path('../../..', __FILE__), 'locale')
      locale_domain = 'foreman_ansible'

      Foreman::Gettext::Support.add_text_domain locale_domain, locale_dir
    end

    assets_to_precompile =
      Dir.chdir(root) do
        Dir['app/assets/javascripts/**/**/*'].map do |f|
          f.split(File::SEPARATOR, 4).last
        end
      end

    initializer 'foreman_ansible.assets.precompile' do |app|
      app.config.assets.precompile += assets_to_precompile
    end

    initializer 'foreman_ansible.configure_assets', :group => :assets do
      SETTINGS[:foreman_ansible] =
        { :assets => { :precompile => assets_to_precompile } }
    end

    initializer 'foreman_ansible.register_plugin', :before => :finisher_hook do
      Foreman::Plugin.register :foreman_ansible do
        requires_foreman '>= 1.12'

        security_block :foreman_ansible do
          permission :play_roles_on_host,
                     { :hosts => [:play_roles, :multiple_play_roles,
                                  :play_ad_hoc_role],
                       :'api/v2/hosts' => [:play_roles,
                                           :multiple_play_roles,
                                           :play_ad_hoc_role] },
                     :resource_type => 'Host'
          permission :play_roles_on_hostgroup,
                     { :hostgroups => [:play_roles, :play_ad_hoc_role],
                       :'api/v2/hostgroups' => [:play_roles,
                                                :multiple_play_roles,
                                                :play_ad_hoc_role] },
                     :resource_type => 'Hostgroup'
          permission :view_ansible_roles,
                     { :ansible_roles => [:index],
                       :'api/v2/ansible_roles' => [:index, :show] },
                     :resource_type => 'AnsibleRole'
          permission :destroy_ansible_roles,
                     { :ansible_roles => [:destroy],
                       :'api/v2/ansible_roles' => [:destroy, :obsolete] },
                     :resource_type => 'AnsibleRole'
          permission :import_ansible_roles,
                     { :ansible_roles => [:import, :confirm_import],
                       :'api/v2/ansible_roles' => [:import] },
                     :resource_type => 'AnsibleRole'
        end

        role 'Ansible Roles Manager',
             [:play_roles_on_host, :play_roles_on_hostgroup,
              :view_ansible_roles, :destroy_ansible_roles,
              :import_ansible_roles]

        role_assignment_params = { :ansible_role_ids => [],
                                   :ansible_roles => [] }
        parameter_filter Host::Managed, role_assignment_params
        parameter_filter Hostgroup, role_assignment_params

        divider :top_menu, :caption => N_('Ansible'), :parent => :configure_menu
        menu :top_menu, :ansible_roles,
             :caption => N_('Roles'),
             :url_hash => { :controller => :ansible_roles, :action => :index },
             :parent => :configure_menu

        apipie_documented_controllers [
          "#{ForemanAnsible::Engine.root}/app/controllers/api/v2/*.rb"
        ]
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

    initializer 'foreman_ansible.apipie' do
      Apipie.configuration.api_controllers_matcher <<
        "#{ForemanAnsible::Engine.root}/app/controllers/api/v2/*.rb"
      Apipie.configuration.checksum_path += ['/foreman_ansible/api/']
    end

    config.to_prepare do
      begin
        foreman_version = ::Foreman::Version.new
        if Rails.env.test? ||
           foreman_version.major.to_i == 1 && foreman_version.minor.to_i < 13
          ::FactImporter.register_fact_importer(:ansible,
                                                ForemanAnsible::FactImporter)
        else
          ::FactImporter.register_fact_importer(
            :ansible,
            ForemanAnsible::StructuredFactImporter
          )
        end
        ::FactParser.register_fact_parser(:ansible, ForemanAnsible::FactParser)
        ::Host::Managed.send(:include, ForemanAnsible::HostManagedExtensions)
        ::Hostgroup.send(:include, ForemanAnsible::HostgroupExtensions)
        ::HostsHelper.send(:include, ForemanAnsible::HostsHelperExtensions)
        ::HostsController.send(
          :include, ForemanAnsible::Concerns::HostsControllerExtensions
        )
        ::Api::V2::HostsController.send(
          :include, ForemanAnsible::Api::V2::HostsControllerExtensions
        )
        ::HostgroupsController.send(
          :include, ForemanAnsible::Concerns::HostgroupsControllerExtensions
        )
        ::Api::V2::HostgroupsController.send(
          :include, ForemanAnsible::Api::V2::HostgroupsControllerExtensions
        )
      rescue => e
        Rails.logger.warn "Foreman Ansible: skipping engine hook (#{e})"
      end
    end
  end
end
