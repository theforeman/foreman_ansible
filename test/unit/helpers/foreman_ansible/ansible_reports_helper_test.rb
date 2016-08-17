require 'test_plugin_helper'

module ForemanAnsible
  module Helpers
    # Tests for the view helper that concerns the Ansible reports styles
    class AnsibleReportsHelperTest < ActiveSupport::TestCase
      include ForemanAnsible::AnsibleReportsHelper

      test 'ansible_report? returns false when log is not parseable' do
        refute ansible_report?('')
      end

      test 'ansible_report? returns false when log is from Puppet' do
        refute ansible_report?(FactoryGirl.build(:log))
      end

      test 'ansible_report? returns true when log contains module_name' do
        log = FactoryGirl.build(:log)
        log.source.value = '{ "module_name" : "foo" }'
        assert ansible_report?(log)
      end
    end
  end
end
