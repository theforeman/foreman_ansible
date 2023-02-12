# frozen_string_literal: true

module ForemanAnsible
  # This module takes the config reports stored in Foreman for Ansible and
  # modifies them to be properly presented in views
  module AnsibleReportsHelper
    def ansible_module_name(log)
      source_value = log.source&.value
      name = source_value.split(':')[0].strip if source_value&.include?(':')
      name
    end

    def ansible_task_name(log)
      source_value = log.source&.value
      return source_value || no_data_message unless source_value.include? ':'
      name = source_value.split(':')[1].strip if source_value.include?(':')
      name || no_data_message
    end

    def ansible_run_in_check_mode?(log)
      log.message&.value == 'check_mode_enabled' if check_mode_log?(log)
    end

    def check_mode_log?(log)
      log.source&.value == 'check_mode'
    end

    def ansible_module_message(log)
      msg_json = parsed_message_json(log)
      return _("Execution error: #{msg_json['msg']}") if msg_json['failed'].present?
      return msg_json['censored'] if msg_json['censored'].present?

      module_action = msg_json.fetch('module', '').delete_prefix('ansible.builtin.').delete_prefix('ansible.legacy.')
      case module_action
      when 'package'
        msg_json['results'].empty? ? msg_json['msg'] : msg_json['results']
      when 'template'
        get_results(msg_json) do |module_args, result|
          _("Rendered template #{module_args['_original_basename']} to #{result['dest']}")
        end
      when 'service'
        get_results(msg_json) do |_, result|
          _("Service #{result['name']} #{result['state']} (enabled: #{result['enabled']})")
        end
      when 'group'
        get_results(msg_json) do |_, result|
          _("User group #{result['name']} #{result['state']}, gid: #{result['gid']}")
        end
      when 'user'
        get_results(msg_json) do |_, result|
          _("User #{result['name']} #{result['state']}, uid: #{result['uid']}")
        end
      when 'cron'
        get_results(msg_json) do |module_args, _|
          _("Cron job: #{module_args['minute']} #{module_args['hour']} #{module_args['day']} #{module_args['month']} #{module_args['weekday']} #{module_args['job']} (disabled: #{module_args['disabled']})")
        end
      when 'copy'
        get_results(msg_json) do |module_args, result|
          _("Copy #{module_args['_original_basename']} to #{result['dest']}")
        end
      when 'command', 'shell'
        msg_json['stdout_lines']
      else
        no_data_message
      end
    end

    def no_data_message
      _('No additional data')
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

    def get_results(msg_json)
      results = msg_json.key?('results') ? msg_json['results'] : [msg_json]
      results.map do |result|
        module_args = result.fetch('invocation', {}).fetch('module_args', {})
        yield module_args, result
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
