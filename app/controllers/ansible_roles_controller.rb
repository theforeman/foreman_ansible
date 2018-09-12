# frozen_string_literal: true

# UI controller for ansible roles
class AnsibleRolesController < ::ApplicationController
  include Foreman::Controller::AutoCompleteSearch
  include ForemanAnsible::Concerns::ImportControllerHelper

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
    if changed.values.all?(&:empty?)
      success no_changed_roles_message
      redirect_to ansible_roles_path
    else
      render :locals => { :changed => changed }
    end
  end

  def confirm_import
    @importer.finish_import(params[:changed].to_unsafe_h)
    success _('Import of roles successfully finished.')
    redirect_to ansible_roles_path
  end

  private

  def default_order
    params[:order] ||= 'name ASC'
  end

  def create_importer
    @importer = ForemanAnsible::UiRolesImporter.new(@proxy)
  end

  def no_changed_roles_message
    return _('No changes in roles detected.') if @proxy.blank?
    _('No changes in roles detected on %s.') % @proxy.name
  end
end
