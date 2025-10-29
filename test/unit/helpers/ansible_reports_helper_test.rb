# frozen_string_literal: true

require 'test_plugin_helper'

class AnsibleReportsHelperTest < ActiveSupport::TestCase
  include ForemanAnsible::AnsibleReportsHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::UrlHelper
  include ERB::Util

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

  test 'accepting an almost empty message' do
    log_value = <<-ANSIBLELOG.strip_heredoc
    {"changed": true, "failed": false, "module": "copy"}
ANSIBLELOG
    message = FactoryBot.build(:message, value: log_value)
    log = FactoryBot.build(:log)
    log.message = message
    assert_match(
      /Copy/,
      ansible_module_message(log).to_s
    )
  end

  test 'FQCN module message extraction' do
    log_value = <<-ANSIBLELOG.strip_heredoc
    {"msg": "Nothing to do", "changed": false, "results": [], "rc": 0, "invocation": {"module_args": {"name": ["openssh"], "state": "present", "allow_downgrade": false, "autoremove": false, "bugfix": false, "disable_gpg_check": false, "disable_plugin": [], "disablerepo": [], "download_only": false, "enable_plugin": [], "enablerepo": [], "exclude": [], "installroot": "/", "install_repoquery": true, "install_weak_deps": true, "security": false, "skip_broken": false, "update_cache": false, "update_only": false, "validate_certs": true, "lock_timeout": 30, "conf_file": null, "disable_excludes": null, "download_dir": null, "list": null, "releasever": null}}, "_ansible_no_log": false, "failed": false, "module": "ansible.builtin.package"}
ANSIBLELOG
    message = FactoryBot.build(:message, value: log_value)
    log = FactoryBot.build(:log)
    log.message = message
    assert_match(
      /Nothing to do/,
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
      /output has been hidden/,
      ansible_module_message(log).to_s
    )
  end

  test 'module message extraction with action' do
    example_report = JSON.parse(File.read(ansible_fixture_file('report.json'))).second
    report = ConfigReport.import(example_report)
    expected_outputs = [
      'No additional data',
      ['Cron job: 0 5,2 * * * date > /dev/null (disabled: false)', 'Cron job: 0 5,2 * * * df > /dev/null (disabled: false)'],
      ['Cron job: 0 5,2 * * * hostname > /dev/null (disabled: false)'],
      ['Rendered template test1.txt.j2 to /tmp/test1.txt. No Diff', 'Rendered template test2.txt.j2 to /tmp/test2.txt. No Diff'],
      ['Rendered template test3.txt.j2 to /tmp/test3.txt. No Diff'],
      ['Copy test4.txt to /tmp/test4.txt. No Diff', 'Copy test5.txt to /tmp/test5.txt. No Diff'],
      ['Copy test6.txt to /tmp/test6.txt. No Diff'],
      ["Copy test7.txt to /tmp/test7.txt. <a data-diff=\"\n--- /tmp/test7.txt\n+++ /tmp/test7.txt\n@@ -0,0 +1 @@\n+Hello\n\" data-title=\"/tmp/test7.txt\" onclick=\"tfm.configReportsModalDiff.showDiff(this);\" href=\"#\">Show Diff</a>"],
      ['Service chronyd started (enabled: )', 'Service firewalld started (enabled: )'],
      ['Service chronyd started (enabled: )']
    ]
    actual_outputs = []
    report.logs.each do |log|
      actual_outputs << ansible_module_message(log)
    end
    assert_equal expected_outputs, actual_outputs
  end
end
