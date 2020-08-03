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
        raw['reporter'] == 'ansible' || ansible_legacy_report?(raw['logs'])
      end

      def ansible_legacy_report?(logs)
        return false if logs.blank?
        logs.any? do |log|
          log['log'].fetch('messages', {}).
            fetch('message', '') =~ /"_ansible_parsed"/
        end
      end
    end
  end
end
