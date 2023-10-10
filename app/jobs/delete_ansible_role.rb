class DeleteAnsibleRole < ::ApplicationJob
  queue_as :default

  def humanized_name
    _('Delete Ansible Role from Smart Proxy')
  end

  def perform(role_name, proxy)
    vcs_cloner = ForemanAnsible::VcsCloner.new(proxy)
    vcs_cloner.delete_role role_name
  end
end
