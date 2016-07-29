# UI controller for ansible roles
class AnsibleRolesController < ::ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  before_action :find_resource, :only => [:destroy]
  before_action :find_proxy, :only => [:import]
  before_action :create_importer, :only => [:import, :confirm_import]

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
      msg = _('No changes in roles detected')
      msg += (_(' on %s.') % @proxy.name) if @proxy
      notice msg
      redirect_to ansible_roles_path
    else
      render :locals => { :changed => changed }
    end
  end

  def confirm_import
    @importer.finish_import(params[:changed])
    notice _('Import of roles successfully finished.')
    redirect_to ansible_roles_path
  end

  private

  def find_proxy
    return nil unless params[:proxy]
    @proxy = SmartProxy.authorized(:view_smart_proxies).find(params[:proxy])
  end

  def create_importer
    @importer = ForemanAnsible::UiRolesImporter.new(@proxy)
  end
end
