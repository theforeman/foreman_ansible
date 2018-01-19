module ForemanAnsible
  # This module takes the config reports stored in Foreman for Ansible and
  # modifies them to be properly presented in views
  module AnsibleReportsHelper
    ANSIBLE_META_KEYS = %w[
      _ansible_parsed _ansible_no_log _ansible_item_result
      _ansible_ignore_errors _ansible_verbose_always
    ].freeze
    ANSIBLE_HIDDEN_KEYS = %w[
      invocation module_args results
    ].freeze

    def module_name(log)
      log.source.value.split(':')[0].strip
    end

    def module_args(log)
      parsed_log = parsed_message_json(log)
      invocations = []
      invocations << parsed_log.delete('invocation')
      results = parsed_log.delete('results')
      invocations << results
      invocations = invocations.compact.flatten.map { |ih| remove_keys(ih) }
      pretty_print_hash invocations
    end

    def ansible_module_message(log)
      message_hash = parsed_message_json(log)
      message_hash = remove_keys(message_hash, ANSIBLE_HIDDEN_KEYS)
      pretty_print_hash message_hash
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

    private

    def pretty_print_hash(hash)
      prettyp = JSON.pretty_generate(remove_keys(hash))
      prettyp.gsub!(/{\n*/, "\n")
      prettyp.gsub!(/},*\n*/, "\n")
      prettyp.gsub!(/^(\[|\])/, '')
      prettyp.gsub!(/^[\s]*$\n/, '')
      paragraph_style = 'white-space:pre;padding: 2em 0'
      content_tag(:p, prettyp, :style => paragraph_style)
    end

    def remove_keys(hash, keys = nil)
      hash.each do |key, value|
        if value.is_a? Array
          value.each { |h| remove_keys(h, keys) }
        elsif value.is_a? Hash
          remove_keys(value, keys)
        elsif (keys || ANSIBLE_META_KEYS).include? key
          hash.delete(key)
        end
      end
    end

    def parsed_message_json(log)
      JSON.parse(log.message.value)
    rescue StandardError
      false
    end
  end
end
