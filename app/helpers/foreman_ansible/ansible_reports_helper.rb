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
      module_action = msg_json['module']
      case module_action
      when 'package'
        msg_json['results'].empty? ? msg_json['msg'] : msg_json['results']
      when 'template'
        module_args = msg_json['invocation']['module_args']
        _("Rendered template #{module_args['_original_basename']} to #{msg_json['dest']}")
      when 'service'
        _("Service #{msg_json['name']} #{msg_json['state']} (enabled: #{msg_json['enabled']})")
      when 'group'
        _("User group #{msg_json['name']} #{msg_json['state']}, gid: #{msg_json['gid']}")
      when 'user'
        _("User #{msg_json['name']} #{msg_json['state']}, uid: #{msg_json['uid']}")
      when 'cron'
        module_args = msg_json['invocation']['module_args']
        _("Cron job: #{module_args['minute']} #{module_args['hour']} #{module_args['day']} #{module_args['month']} #{module_args['weekday']} #{module_args['job']} (disabled: #{module_args['disabled']})")
      when 'copy'
        module_args = msg_json['invocation']['module_args']
        _("Copy #{module_args['_original_basename']} to #{msg_json['dest']}")
      when 'command', 'shell'
        msg_json['stdout_lines']
      else
        no_data_message
      end
    end

    def no_data_message
      _('No additional data')
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

    def parsed_message_json(log)
      JSON.parse(log.message.value)
    rescue StandardError => e
      Foreman::Logging.exception('Error while parsing ansible message json', e)
      {}
    end
  end
end
