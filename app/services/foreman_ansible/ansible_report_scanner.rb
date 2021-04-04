# frozen_string_literal: true

module ForemanAnsible
  # Scans ConfigReports after import for indicators of an Ansible report and
  # sets the origin of the report to 'Ansible'
  class AnsibleReportScanner
    class << self
      def add_reporter_data(_report, raw)
        check_mode_message = raw['check_mode'] ? 'check_mode_enabled' : 'check_mode_disabled'
        check_mode_log = {
          'log': {
            'sources': {
              'source': 'check_mode'
            },
            'messages': {
              'message': check_mode_message
            },
            'level': 'info'
          }
        }
        raw['logs'].insert(0, check_mode_log.deep_stringify_keys)
      end

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
