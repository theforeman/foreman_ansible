# frozen_string_literal: true

require 'test_plugin_helper'

class AnsibleReportsHelperTest < ActiveSupport::TestCase
  include ForemanAnsible::AnsibleReportsHelper
  include ActionView::Helpers::TagHelper

  test 'is able to print a string instead of a hash' do
    log_value = <<-ANSIBLELOG.strip_heredoc
  {"_ansible_parsed": true, "_ansible_no_log": false, "changed": false, "results": ["ntp-4.2.8p10-3.fc27.x86_64 providing ntp is already installed"], "rc": 0, "invocation": {"module_args": {"allow_downgrade": false, "name": ["ntp"], "list": null, "disable_gpg_check": false, "conf_file": null, "install_repoquery": true, "state": "installed", "disablerepo": null, "update_cache": false, "enablerepo": null, "exclude": null, "security": false, "validate_certs": true, "installroot": "/", "skip_broken": false}}, "msg": ""}
ANSIBLELOG
    message = FactoryBot.build(:message)
    message.value = log_value
    log = FactoryBot.build(:log)
    log.message = message
    assert_match(
      /ntp-4.2.8p10-3.fc27.x86_64 providing ntp is already installed/,
      module_invocations(parsed_message_json(log)).to_s
    )
  end

  test 'pretty print is able to print a hash' do
    hash = {
      'allow_downgrade' => false,
      'name' => ['ntp'],
      'list' => nil,
      'disable_gpg_check' => false,
      'conf_file' => nil,
      'install_repoquery' => true,
      'state' => 'installed',
      'disablerepo' => nil,
      'update_cache' => false,
      'enablerepo' => nil,
      'exclude' => nil,
      'security' => false,
      'validate_certs' => true,
      'installroot' => '/',
      'skip_broken' => false
    }
    assert_equal(
      hash,
      remove_keys(
        hash
      )
    )
  end
end
