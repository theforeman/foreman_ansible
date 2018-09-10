# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAnsible
  # Test for the structured facts importer - its code mostly lives in Foreman
  # core, so only details have to be tested here.
  class StructuredFactImporterTest < ActiveSupport::TestCase
    test 'if host is not in Foreman, use hostname provided by call' do
      fake_host = Host.new(:name => 'fake')
      importer = ForemanAnsible::StructuredFactImporter.new(
        fake_host,
        facts_json
      )
      assert_equal fake_host, importer.send(:host)
    end

    test 'if host is in Foreman, use hostname provided by Ansible' do
      ansible_fqdn_host = FactoryBot.build(:host)
      ansible_fqdn_host.name = facts_json[:ansible_facts][:ansible_fqdn]
      ansible_fqdn_host.save
      importer = ForemanAnsible::StructuredFactImporter.new(
        Host.new(:name => 'fake'),
        facts_json
      )

      assert_equal ansible_fqdn_host, importer.send(:host)
    end
  end
end
