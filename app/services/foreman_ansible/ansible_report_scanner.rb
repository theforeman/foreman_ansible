# frozen_string_literal: true

module ForemanAnsible
  # Scans ConfigReports after import for indicators of an Ansible report and
  # sets the origin of the report to 'Ansible'
  class AnsibleReportScanner
    class << self
      def scan(report, logs)
        if (is_ansible = ansible_report?(logs))
          report.origin = 'Ansible'
        end
        is_ansible
      end

      def ansible_report?(logs)
        return false if logs.blank?
        logs.any? do |log|
          log['log'].fetch('messages', {}).
            fetch('message', '') =~ /"_ansible_parsed"/
        end
      end
    end
  end
end
