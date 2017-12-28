# rubocop:disable BlockLength
Foreman::Plugin.register :foreman_ansible do
  requires_foreman '>= 1.16'

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

  add_all_permissions_to_default_roles

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
# rubocop:enable BlockLength
