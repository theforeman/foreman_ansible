class UIAnsibleRolesController < ::Api::V2::BaseController
  def resource_name(resource = 'AnsibleRole')
    super resource
  end

  def index
    @ui_ansible_roles = resource_scope_for_index(:permission => :view_ansible_roles)
  end

  api :DELETE, '/ui_ansible_roles/:id', N_('Deletes Ansible role')
  param :id, :identifier, :required => true
  def destroy
    AnsibleRole.find_by!(id: params[:id]).destroy
  end

  # restore original method from find_common to ignore resource nesting
  def resource_scope(**kwargs)
    @resource_scope ||= scope_for(resource_class, **kwargs)
  end
end
