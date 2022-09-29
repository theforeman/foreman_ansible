# frozen_string_literal: true

Foreman::Plugin.register :foreman_ansible do
  requires_foreman '>= 3.5'

  settings do
    category :ansible, N_('Ansible') do
      setting 'ansible_ssh_private_key_file',
              type: :string,
              description: N_('Use this to supply a path to an SSH Private Key '\
                               'that Ansible will use in lieu of a password '\
                               'Override with "ansible_ssh_private_key_file" '\
                               'host parameter'),
              default: '',
              full_name: N_('Private Key Path')
      setting 'ansible_connection',
              type: :string,
              description: N_('Use this connection type by default when running '\
                               'Ansible playbooks. You can override this on hosts by '\
                               'adding a parameter "ansible_connection"'),
              default: 'ssh',
              full_name: N_('Connection type')
      setting 'ansible_winrm_server_cert_validation',
              type: :string,
              description: N_('Enable/disable WinRM server certificate '\
                               'validation when running Ansible playbooks. You can override '\
                               'this on hosts by adding a parameter '\
                               '"ansible_winrm_server_cert_validation"'),
              default: 'validate',
              full_name: N_('WinRM cert Validation')
      setting 'ansible_verbosity',
              type: :integer,
              description: N_('Foreman will add this level of verbosity for '\
                               'additional debugging output when running Ansible playbooks.'),
              default: '0',
              full_name: N_('Default verbosity level'),
              value: nil,
              collection: proc {
                { '0' => N_('Disabled'),
                  '1' => N_('Level 1 (-v)'),
                  '2' => N_('Level 2 (-vv)'),
                  '3' => N_('Level 3 (-vvv)'),
                  '4' => N_('Level 4 (-vvvv)') }
              }
      setting 'ansible_post_provision_timeout',
              type: :integer,
              description: N_('Timeout (in seconds) to set when Foreman will trigger a '\
                               'play Ansible roles task after a host is fully provisioned. '\
                               'Set this to the maximum time you expect a host to take '\
                               'until it is ready after a reboot.'),
              default: '360',
              full_name: N_('Post-provision timeout')
      setting 'ansible_interval',
              type: :integer,
              description: N_('Timeout (in minutes) when hosts should have reported.'),
              default: '30',
              full_name: N_('Ansible report timeout')
      setting 'ansible_out_of_sync_disabled',
              type: :boolean,
              description: format(N_('Disable host configuration status turning to out of'\
                               ' sync for %{cfgmgmt} after report does not arrive within'\
                               ' configured interval'), :cfgmgmt => 'Ansible'),
              default: false,
              full_name: format(N_('%{cfgmgmt} out of sync disabled'), :cfgmgmt => 'Ansible')
      setting  'ansible_inventory_template',
               type: :string,
               description: N_('Foreman will use this template to schedule the report '\
                                 'with Ansible inventory'),
               default: 'Ansible - Ansible Inventory',
               full_name: N_('Default Ansible inventory report template')
      setting 'ansible_roles_to_ignore',
              type: :array,
              description: N_('Those roles will be excluded when importing roles from smart proxy, '\
                'The expected input is comma separated values and you can use * wildcard metacharacters'\
                'For example: foo*, *b*,*bar'),
              default: [],
              full_name: N_('Ansible roles to ignore')
      setting 'foreman_ansible_proxy_batch_size',
              type: :integer,
              description: N_('Number of tasks which should be sent to the smart proxy in one request, '\
                              'if foreman_tasks_proxy_batch_trigger is enabled. '\
                              'If set, overrides foreman_tasks_proxy_batch_size setting for Ansible jobs.'),
              default: nil,
              full_name: N_('Proxy tasks batch size for Ansible')
    end
  end

  security_block :foreman_ansible do
    permission :play_roles_on_host,
               { :hosts => [:play_roles, :multiple_play_roles],
                 :'api/v2/hosts' => [:play_roles,
                                     :multiple_play_roles] },
               :resource_type => 'Host'
    permission :play_roles_on_hostgroup,
               { :hostgroups => [:play_roles],
                 :'api/v2/hostgroups' => [:play_roles,
                                          :multiple_play_roles] },
               :resource_type => 'Hostgroup'
    permission :view_ansible_roles,
               { :ansible_roles => [:index, :auto_complete_search],
                 :'api/v2/ansible_roles' => [:index, :show, :fetch],
                 :ui_ansible_roles => [:index] },
               :resource_type => 'AnsibleRole'
    permission :destroy_ansible_roles,
               { :ansible_roles => [:destroy],
                 :'api/v2/ansible_roles' => [:destroy, :obsolete] },
               :resource_type => 'AnsibleRole'
    permission :import_ansible_roles,
               { :ansible_roles => [:import, :confirm_import],
                 :'api/v2/ansible_roles' => [:import, :sync] },
               :resource_type => 'AnsibleRole'
    permission :view_ansible_variables,
               {
                 :lookup_values => [:index],
                 :ansible_variables => [:index, :auto_complete_search],
                 :'api/v2/ansible_variables' => [:index, :show]
               },
               :resource_type => 'AnsibleVariable'
    permission :edit_ansible_variables,
               { :lookup_values => [:update],
                 :ansible_variables => [:edit, :update],
                 :'api/v2/ansible_variables' => [:update],
                 :'api/v2/ansible_override_values' => [:create, :destroy] },
               :resource_type => 'AnsibleVariable'
    permission :destroy_ansible_variables,
               {
                 :lookup_values => [:destroy],
                 :ansible_variables => [:destroy],
                 :'api/v2/ansible_variables' => [:destroy, :obsolete]
               },
               :resource_type => 'AnsibleVariable'
    permission :create_ansible_variables,
               {
                 :lookup_values => [:create],
                 :ansible_variables => [:new, :create],
                 :'api/v2/ansible_variables' => [:create]
               },
               :resource_type => 'AnsibleVariable'
    permission :import_ansible_variables,
               {
                 :ansible_variables => [:import, :confirm_import],
                 :'api/v2/ansible_variables' => [:import]
               },
               :resource_type => 'AnsibleVariable'
    permission :view_hosts,
               { :'api/v2/hosts' => [:ansible_roles],
                 :'api/v2/ansible_inventories' => [:hosts] },
               :resource_type => 'Host'
    permission :view_hostgroups,
               { :'api/v2/hostgroups' => [:ansible_roles],
                 :'api/v2/ansible_inventories' => [:hostgroups] },
               :resource_type => 'Hostgroup'
    permission :edit_hosts,
               { :'api/v2/hosts' => [:assign_ansible_roles] },
               :resource_type => 'Host'
    permission :edit_hostgroups,
               { :'api/v2/hostgroups' => [:assign_ansible_roles] },
               :resource_type => 'Hostgroup'
    permission :generate_ansible_inventory,
               { :'api/v2/ansible_inventories' => [:schedule] }
    permission :import_ansible_playbooks,
               { :'api/v2/ansible_playbooks' => [:sync, :fetch] }
  end

  role 'Ansible Roles Manager',
       [:play_roles_on_host, :play_roles_on_hostgroup,
        :create_job_invocations, :view_job_templates,      # to allow the play_roles
        :create_template_invocations, :view_smart_proxies, # ...
        :view_ansible_roles, :destroy_ansible_roles,
        :import_ansible_roles, :view_ansible_variables,
        :create_ansible_variables, :import_ansible_variables,
        :edit_ansible_variables, :destroy_ansible_variables, :import_ansible_playbooks]

  role 'Ansible Tower Inventory Reader',
       [:view_hosts, :view_hostgroups, :view_facts, :generate_report_templates, :generate_ansible_inventory,
        :view_report_templates],
       'Permissions required for the user which is used by Ansible Tower Dynamic Inventory Item'

  add_all_permissions_to_default_roles
  extend_template_helpers ForemanAnsible::RendererMethods
  allowed_template_helpers :insights_remediation

  base_role_assignment_params = { :ansible_role_ids => [],
                                  :ansible_roles => [] }
  parameter_filter Host::Managed, base_role_assignment_params.merge(:host_ansible_roles_attributes => {})
  parameter_filter Hostgroup, base_role_assignment_params.merge(:hostgroup_ansible_roles_attributes => {})

  register_global_js_file 'global'

  extend_graphql_type :type => '::Types::Host' do
    field :all_ansible_roles, ::Types::InheritedAnsibleRole.connection_type, :null => true, :resolver_method => :present_all_ansible_roles
    field :own_ansible_roles, ::Types::AnsibleRole.connection_type, :null => true
    field :available_ansible_roles, ::Types::AnsibleRole.connection_type, :null => true
    field :ansible_variables_with_overrides, Types::OverridenAnsibleVariable.connection_type, :null => false

    def present_all_ansible_roles
      inherited_ansible_roles = object.inherited_ansible_roles.map { |role| ::Presenters::AnsibleRolePresenter.new(role, true) }
      ansible_roles = object.ansible_roles.map { |role| ::Presenters::AnsibleRolePresenter.new(role, false) }
      (inherited_ansible_roles + ansible_roles).uniq
    end

    def ansible_variables_with_overrides
      resolver = ::ForemanAnsible::OverrideResolver.new(object)
      AnsibleVariable.where(:ansible_role_id => object.all_ansible_roles.pluck(:id), :override => true).map { |variable| ::Presenters::OverridenAnsibleVariablePresenter.new variable, resolver }
    end
  end

  register_graphql_query_field :ansible_roles, '::Types::AnsibleRole', :collection_field
  register_graphql_mutation_field :assign_ansible_roles, '::Mutations::Hosts::AssignAnsibleRoles'
  register_graphql_mutation_field :delete_ansible_variable_override, ::Mutations::AnsibleVariableOverrides::Delete
  register_graphql_mutation_field :update_ansible_variable_override, ::Mutations::AnsibleVariableOverrides::Update
  register_graphql_mutation_field :create_ansible_variable_override, ::Mutations::AnsibleVariableOverrides::Create

  divider :top_menu, :caption => N_('Ansible'), :parent => :configure_menu
  menu :top_menu, :ansible_roles,
       :caption => N_('Roles'),
       :url_hash => { :controller => :ansible_roles, :action => :index },
       :parent => :configure_menu
  menu :top_menu, :ansible_variables,
       :caption => N_('Variables'),
       :url_hash => { :controller => :ansible_variables, :action => :index },
       :parent => :configure_menu

  apipie_documented_controllers [
    "#{ForemanAnsible::Engine.root}/app/controllers/api/v2/*.rb"
  ]
  ApipieDSL.configuration.dsl_classes_matchers += [
    "#{ForemanAnsible::Engine.root}/app/models/*.rb",
    "#{ForemanAnsible::Engine.root}/app/services/foreman_ansible/*.rb"
  ]

  register_info_provider ForemanAnsible::AnsibleInfo

  # For backwards compatiblity with 1.17
  if respond_to?(:register_report_scanner)
    register_report_scanner ForemanAnsible::AnsibleReportScanner
    register_report_origin 'Ansible', 'ConfigReport'
  end

  describe_host do
    multiple_actions_provider :ansible_hosts_multiple_actions
  end

  describe_hostgroup do
    hostgroup_actions_provider :ansible_hostgroups_actions
  end
end
