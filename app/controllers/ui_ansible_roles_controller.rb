class UiAnsibleRolesController < ::Api::V2::BaseController
  def resource_name(resource = 'AnsibleRole')
    super resource
  end

  layout 'api/v2/layouts/index_layout', :only => [:index]

  def index
    @ui_ansible_roles = resource_scope_for_index(:permission => :view_ansible_roles)
  end

  # restore original method from find_common to ignore resource nesting
  def resource_scope(options = {})
    @resource_scope ||= scope_for(resource_class, options)
  end
end
