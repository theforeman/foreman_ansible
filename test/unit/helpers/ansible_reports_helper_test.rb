# frozen_string_literal: true

require 'test_plugin_helper'

class AnsibleReportsHelperTest < ActiveSupport::TestCase
  include ForemanAnsible::AnsibleReportsHelper
  include ActionView::Helpers::TagHelper

  test 'module message extraction' do
    log_value = <<-ANSIBLELOG.strip_heredoc
    {"msg": "Nothing to do", "changed": false, "results": [], "rc": 0, "invocation": {"module_args": {"name": ["openssh"], "state": "present", "allow_downgrade": false, "autoremove": false, "bugfix": false, "disable_gpg_check": false, "disable_plugin": [], "disablerepo": [], "download_only": false, "enable_plugin": [], "enablerepo": [], "exclude": [], "installroot": "/", "install_repoquery": true, "install_weak_deps": true, "security": false, "skip_broken": false, "update_cache": false, "update_only": false, "validate_certs": true, "lock_timeout": 30, "conf_file": null, "disable_excludes": null, "download_dir": null, "list": null, "releasever": null}}, "_ansible_no_log": false, "failed": false, "module": "package"}
ANSIBLELOG
    message = FactoryBot.build(:message)
    message.value = log_value
    log = FactoryBot.build(:log)
    log.message = message
    assert_match(
      /Nothing to do/,
      ansible_module_message(log).to_s
    )
  end
end
