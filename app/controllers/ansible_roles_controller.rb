# frozen_string_literal: true

# UI controller for ansible roles
class AnsibleRolesController < ::ApplicationController
  include Foreman::Controller::AutoCompleteSearch
  include ForemanAnsible::Concerns::ImportControllerHelper
  include ::ForemanAnsible::AnsibleRolesDataPreparations
  def index
    @ansible_roles = resource_base.search_for(params[:search],
                                              :order => params[:order]).
                     paginate(:page => params[:page],
                              :per_page => params[:per_page])
  end

  def destroy
    if @ansible_role.destroy
      process_success
    else
      process_error
    end
  end

  def import
    changed = @importer.import!
    @rows = prepare_ansible_import_rows(changed, @variables_importer)
    if @rows.empty?
      success no_changed_roles_message
      redirect_to ansible_roles_path
    else
      render
    end
  end

  def confirm_import
    @importer.finish_import(params[:changed]&.to_unsafe_h)
    @variables_importer.import_variables_roles(params[:changed]) if params[:changed]['new'] || params[:changed]['old']
    success _('Import of roles and their variables was successfully finished.')
  end

  private

  def default_order
    params[:order] ||= 'name ASC'
  end

  def create_importer
    @importer = ForemanAnsible::UiRolesImporter.new(@proxy)
    @variables_importer = ForemanAnsible::VariablesImporter.new(@proxy)
  end

  def no_changed_roles_message
    return _('No added or removed roles nor variables.') if @proxy.blank?
    _('No added or removed roles nor variables detected on %s.') % @proxy.name
  end
end
