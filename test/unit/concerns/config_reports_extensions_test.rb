# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for the behavior of Host with roles, checks inheritance, etc
class ConfigReportExtensionsTest < ActiveSupport::TestCase
  let(:example_report) do
    JSON.parse(File.read(ansible_fixture_file('report.json')))
  end

  describe '.import' do
    it 'sets an origin for Ansible reports' do
      report = ConfigReport.import(example_report)
      assert_equal 'Ansible', report.origin
    end

    it 'sets no origin for other reports' do
      report = ConfigReport.import(
        'host' => 'io.local',
        'reported_at' => Time.now.utc.to_s
      )
      assert_nil report.origin
    end
  end
end
