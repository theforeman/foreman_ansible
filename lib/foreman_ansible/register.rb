# frozen_string_literal: true

Foreman::Plugin.register :foreman_ansible do
  requires_foreman '>= 2.2'

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
                 :'api/v2/ansible_roles' => [:import] },
               :resource_type => 'AnsibleRole'
    permission :view_ansible_variables,
               {
                 :ansible_variables => [:index, :auto_complete_search],
                 :'api/v2/ansible_variables' => [:index, :show]
               },
               :resource_type => 'AnsibleVariable'
    permission :edit_ansible_variables,
               { :ansible_variables => [:edit, :update],
                 :'api/v2/ansible_variables' => [:update],
                 :'api/v2/ansible_override_values' => [:create, :destroy] },
               :resource_type => 'AnsibleVariable'
    permission :destroy_ansible_variables,
               {
                 :ansible_variables => [:destroy],
                 :'api/v2/ansible_variables' => [:destroy, :obsolete]
               },
               :resource_type => 'AnsibleVariable'
    permission :create_ansible_variables,
               {
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
  end

  role 'Ansible Roles Manager',
       [:play_roles_on_host, :play_roles_on_hostgroup,
        :view_ansible_roles, :destroy_ansible_roles,
        :import_ansible_roles,
        :view_ansible_variables,
        :create_ansible_variables, :import_ansible_variables,
        :edit_ansible_variables, :destroy_ansible_variables]

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
end
