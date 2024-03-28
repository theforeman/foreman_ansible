# frozen_string_literal: true

class CloneAnsibleRole < ::ApplicationJob
  queue_as :default

  def humanized_name
    _('Clone Ansible Role from VCS')
  end

  def perform(repo_info, proxy)
    vcs_cloner = ForemanAnsible::VcsCloner.new(proxy)
    vcs_cloner.install_role repo_info
  end
end
