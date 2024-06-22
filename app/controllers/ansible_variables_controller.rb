# frozen_string_literal: true

# UI controller for ansible variables
class AnsibleVariablesController < ::LookupKeysController
  include Foreman::Controller::AutoCompleteSearch
  include ForemanAnsible::Concerns::ImportControllerHelper
  include Foreman::Controller::Parameters::AnsibleVariable

  before_action :import_new_roles, :only => [:confirm_import]
  before_action :find_required_proxy, :only => [:import]
  before_action :find_resource, :only => [:edit, :update, :destroy],
                                :if => proc { params[:id] }

  def index
    @ansible_variables = resource_base.search_for(params[:search],
                                                  :order => params[:order]).
                         paginate(:page => params[:page],
                                  :per_page => params[:per_page])
  end

  def new
    @ansible_variable = AnsibleVariable.new
  end

  def create
    @ansible_variable = AnsibleVariable.new(ansible_variable_params.merge(:imported => false))
    if @ansible_variable.save
      process_success
    else
      process_error
    end
  end

  def import
    import_roles = @importer_roles.import_role_names
    import_roles[:new_roles] = import_roles[:new]
    import_variables = @importer.import_variable_names(import_roles[:new_roles])
    if import_variables.values.all?(&:empty?)
      success(_('No changes in variables detected on %s.') % @proxy.name)
      redirect_to ansible_variables_path
    else
      render 'ansible_variables/import',
             :locals => { :changed => import_variables }
    end
  end

  def confirm_import
    results = @importer.finish_import(new_vars, old_vars, updated_vars)
    success _(
      "Import of variables successfully finished.\n"\
      "Added: #{results[:added].count} \n "\
      "Removed: #{results[:obsolete].count} \n"\
      "Updated: #{results[:updated].count}"
    )
    redirect_to ansible_variables_path
  end

  private

  def default_order; end

  def resource
    @ansible_variable
  end

  def resource_params
    ansible_variable_params
  end

  def new_vars
    fetch_vars :new
  end

  def old_vars
    fetch_vars :obsolete
  end

  def updated_vars
    fetch_vars :update
  end

  def fetch_vars(key)
    params.fetch(:changed, {}).fetch(key, {}).try(:as_json) || {}
  end

  def import_new_roles
    return if new_vars.blank?
    new_vars.each_key do |role_name|
      ::AnsibleRole.find_or_create_by(:name => role_name)
    end
  end

  def create_importer
    @importer = ForemanAnsible::VariablesImporter.new(@proxy)
    @importer_roles = ForemanAnsible::UIRolesImporter.new(@proxy)
  end

  def find_required_proxy
    id = params['proxy']
    @smart_proxy = SmartProxy.authorized(:view_smart_proxies).find(id)
    unless @smart_proxy&.has_feature?('Ansible')
      not_found _('No proxy found to import variables from, ensure that the '\
                  'smart proxy has the Ansible feature enabled.')
    end
    @smart_proxy
  end

  def controller_permission
    'ansible_variables'
  end
end
