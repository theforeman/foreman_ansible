# frozen_string_literal: true

class UpdateAnsibleRole < ::ApplicationJob
  queue_as :default

  def humanized_name
    _('Update Ansible Role from VCS')
  end

  def perform(repo_info, proxy)
    vcs_cloner = ForemanAnsible::VcsCloner.new(proxy)
    vcs_cloner.update_role repo_info
  end
end
