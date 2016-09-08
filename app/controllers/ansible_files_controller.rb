# UI controller for ansible files
class AnsibleFilesController < ::ApplicationController
  include Foreman::Controller::AutoCompleteSearch

  before_action :find_resource, :only => [:edit, :update, :destroy]
  before_action :initialize_file, :only => [:create]
  before_action :create_importer, :only => [:edit, :update, :create, :destroy]

  def index
    @ansible_files = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page], :per_page => params[:per_page])
  end

  def edit
    @importer.import(@ansible_file)
    rescue_from_import_error
  end

  def new
    @ansible_file = AnsibleFile.new(:ansible_role_id => params[:role_id])
  end

  def create
    if @ansible_file.valid? && @importer.create_file(@ansible_file)
      @ansible_file.save
      process_success :object => @ansible_file
    else
      process_error :object => @ansible_file
    end
  rescue *import_exceptions => e
    process_import_error e
  end

  def update
    if @ansible_file.valid? && @importer.update_file(@ansible_file)
      process_success :success_redirect => ansible_files_index_path(@ansible_file)
    else
      process_error :object => @ansible_file
    end
  rescue *import_exceptions => e
    process_import_error e
  end

  def destroy
    if @importer.delete_file(@ansible_file) && @ansible_file.destroy
      process_success :object => @ansible_file
    else
      process_error :object => @ansible_file
    end
    rescue_from_import_error
  end

  private

  def find_resource
    super
    @ansible_file.content = params[:ansible_file][:content] if params[:ansible_file]
    @ansible_file
  end

  def initialize_file
    @ansible_file = AnsibleFile.new(ansible_file_params)
  end

  def import_exceptions
    [ProxyAPI::ProxyException, ForemanAnsibleExporter::Error]
  end

  def create_importer
    proxy_id = @ansible_file.ansible_role.proxy_id
    proxy = proxy_id && SmartProxy.find(proxy_id)
    @importer = ForemanAnsible::FilesImporter.new(proxy)
  end

  def ansible_files_index_path(file)
    ansible_files_path(:search => files_index(@ansible_file))
  end

  def rescue_from_import_error
  rescue *import_exceptions => e
    error(e.message)
    redirect_to ansible_files_index_path(@ansible_file)
  end

  def process_import_error(exception)
    process_error :error_msg => exception.message
  end

  def files_index(file)
    "dir = #{file.dir} && ansible_role = #{file.ansible_role.name}"
  end

  def ansible_file_params
    params.require(:ansible_file).permit(:name, :content, :ansible_role_id, :dir)
  end
end
