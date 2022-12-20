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

  test 'module message extraction with error' do
    log_value = <<-ANSIBLELOG.strip_heredoc
    {"msg": "AnsibleUndefinedVariable", "changed": false, "_ansible_no_log": false, "failed": true, "module": "template", "exception": "raise AnsibleUndefinedVariable"}
ANSIBLELOG
    message = FactoryBot.build(:message, value: log_value)
    log = FactoryBot.build(:log, message: message)
    log.message = message

    assert_match(
      'Execution error: AnsibleUndefinedVariable',
      ansible_module_message(log).to_s
    )
  end

  test 'accepting a censored message' do
    log_value = <<-ANSIBLELOG.strip_heredoc
    {"censored": "the output has been hidden due to the fact that 'no_log: true' was specified for this result", "changed": true, "failed": false, "module": "copy"}
ANSIBLELOG
    message = FactoryBot.build(:message, value: log_value)
    log = FactoryBot.build(:log)
    log.message = message
    assert_match(
      /Copy/,
      ansible_module_message(log).to_s
    )
  end
end
