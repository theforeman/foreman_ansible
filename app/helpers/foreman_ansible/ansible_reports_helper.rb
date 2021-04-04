# frozen_string_literal: true

module ForemanAnsible
  # This module takes the config reports stored in Foreman for Ansible and
  # modifies them to be properly presented in views
  module AnsibleReportsHelper
    ANSIBLE_META_KEYS = %w[
      _ansible_parsed _ansible_no_log _ansible_item_result
      _ansible_ignore_errors _ansible_verbose_always _ansible_verbose_override
    ].freeze
    ANSIBLE_HIDDEN_KEYS = %w[
      invocation module_args results ansible_facts
      stdout stderr
    ].freeze

    def ansible_module_name(log)
      source_value = log.source&.value
      name = source_value.split(':')[0].strip if source_value&.include?(':')
      name
    end

    def ansible_run_in_check_mode?(log)
      log.message&.value == 'check_mode_enabled' if check_mode_log?(log)
    end

    def check_mode_log?(log)
      log.source&.value == 'check_mode'
    end

    def ansible_module_args(log)
      report_json_viewer module_invocations parsed_message_json(log)
    end

    def ansible_module_message(log)
      report_json_viewer hash_with_keys_removed parsed_message_json(log)
    end

    def ansible_report_origin_icon
      'foreman_ansible/Ansible.png'
    end

    def ansible_report_origin_partial
      'foreman_ansible/config_reports/ansible'
    end

    def ansible_report?(log)
      module_name(log).present?
    rescue StandardError
      false
    end

    def report_json_viewer(json)
      react_component('ReportJsonViewer', data: json)
    end

    private

    def module_invocations(hash)
      invocations = []
      invocations << hash.delete('invocation')
      results = hash.delete('results')
      invocations << results
      invocations = invocations.compact.flatten.map do |ih|
        ih.is_a?(Hash) ? remove_keys(ih) : ih
      end
      invocations
    end

    def pretty_print_hash(hash)
      prettyp = JSON.pretty_generate(remove_keys(hash))
      prettyp.gsub!(/{\n*/, "\n")
      prettyp.gsub!(/},*\n*/, "\n")
      prettyp.gsub!(/^(\[|\])/, '')
      prettyp.gsub!(/^[\s]*$\n/, '')
      paragraph_style = 'white-space:pre;padding: 2em 0'
      tag(:p, prettyp, :style => paragraph_style)
    end

    def hash_with_keys_removed(hash)
      new_hash = remove_keys(hash)
      remove_keys(new_hash, ANSIBLE_HIDDEN_KEYS)
    end

    def remove_keys(hash, keys = ANSIBLE_META_KEYS)
      hash.each do |key, value|
        if value.is_a? Array
          value.each { |h| remove_keys(h) if h.is_a? Hash }
        elsif value.is_a? Hash
          remove_keys(value)
        end
        hash.delete(key) if keys.include? key
      end
    end

    def parsed_message_json(log)
      JSON.parse(log.message.value)
    rescue StandardError => e
      Foreman::Logging.exception('Error while parsing ansible message json', e)
      {}
    end
  end
end
