# frozen_string_literal: true

module ForemanAnsible
  # Scans ConfigReports after import for indicators of an Ansible report and
  # sets the origin of the report to 'Ansible'
  class AnsibleReportScanner
    class << self
      def add_reporter_data(report, raw); end

      def identify_origin(raw)
        'Ansible' if ansible_report?(raw)
      end

      def ansible_report?(raw)
        raw['reporter'] == 'ansible'
      end
    end
  end
end
