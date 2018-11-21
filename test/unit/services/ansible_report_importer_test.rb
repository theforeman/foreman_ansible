# frozen_string_literal: true

require 'test_plugin_helper'
# Unit tests for AnsibleReportImporter
# This class is just meant to capture the config reports coming
# from Ansible and change anything that is required
class AnsibleReportImporterTest < ActiveSupport::TestCase
  setup do
    @raw = { 'host' => '192.168.121.1' }
    @importer = ::ConfigReportImporter.new(@raw)
  end

  test 'finds host when the hostname is given as the IP' do
    host = ::FactoryBot.create(:host, :ip => @raw['host'])
    ForemanAnsible::AnsibleReportScanner.expects(:ansible_report?).returns(true)
    assert_equal @importer.host, host
  end

  test 'creates new host if IP is not found' do
    ForemanAnsible::AnsibleReportScanner.expects(:ansible_report?).returns(true)
    assert @importer.host.new_record?
  end

  test 'finds host when given partially qualified name' do
    host = ::FactoryBot.create(:host, :hostname => 'ansible-host.example.com')
    ForemanAnsible::AnsibleReportScanner.expects(:ansible_report?).returns(true)
    assert_equal host, ::ConfigReportImporter.new('host' => 'ansible-host').host
  end

  test 'create new host when more hosts match partially qualified name' do
    ::FactoryBot.create(:host, :hostname => 'ansible-host.example.com')
    ::FactoryBot.create(:host, :hostname => 'ansible-host.dummy.org')
    ForemanAnsible::AnsibleReportScanner.expects(:ansible_report?).returns(true)
    assert ::ConfigReportImporter.new('host' => 'ansible-host').host.new_record?
  end
end
