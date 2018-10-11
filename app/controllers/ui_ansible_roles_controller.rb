class UiAnsibleRolesController < ::Api::V2::BaseController
  def resource_name(resource = 'AnsibleRole')
    super resource
  end

  layout 'api/v2/layouts/index_layout', :only => [:index, :variables]

  def index
    @ui_ansible_roles = resource_scope_for_index(:permission => :view_ansible_roles)
  end

  def variables
    # todo: permissions
    @ui_ansible_roles = resource_scope(:permission => :view_ansible_roles).search_for(*search_options).includes(:ansible_variables)
    @override_resolver = ForemanAnsible::OverrideResolver.new(params[:resource_id],
                                                              params[:resource_name],
                                                              params[:parent_id],
                                                              AnsibleVariable.where(:ansible_role_id => @ui_ansible_roles.pluck(:id)))

  end

  # restore original method from find_common to ignore resource nesting
  def resource_scope(options = {})
    @resource_scope ||= scope_for(resource_class, options)
  end
end
