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
          add_diff(_("Rendered template #{module_args['_original_basename']} to #{result['dest']}."), result['dest'], result)
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
          add_diff(_("Copy #{module_args['_original_basename']} to #{result['dest']}."), result['dest'], result)
        end
      when 'command', 'shell'
        msg_json['stdout_lines']
      else
        have_diff = false
        get_results(msg_json) do |module_args, result|
          if result['report_diff'].present?
            have_diff = true
            add_diff('', module_args['path'] || '', result)
          end
        end
        no_data_message unless have_diff
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

    def show_full_error_message_value(message_value)
      tag.div class: 'replace-hidden-value' do
        link_to_function(icon_text('plus', '', class: 'small'), 'replace_value_control(this, "div")',
                         title: _('Show full value'),
                         class: 'replace-hidden-value pull-right') +
          (tag.span class: 'full-value' do
            message_value
          end)
      end
    end

    private

    def get_results(msg_json)
      results = msg_json.key?('results') ? msg_json['results'] : [msg_json]
      results.map do |result|
        if result.is_a?(Hash)
          module_args = result.dig('invocation', 'module_args') || {}
          yield module_args, result
        end
      end
    end

    def parsed_message_json(log)
      JSON.parse(log.message.value)
    rescue StandardError => e
      Foreman::Logging.exception('Error while parsing ansible message json', e)
      {}
    end

    def add_diff(message, title, result)
      diff = if result['report_diff'].blank?
               _('No Diff')
             else
               # Add '\n' before the unified diff as the Javascript displaying the
               # diff expects this.
               link_to(_('Show Diff'), '#', data: { diff: "\n#{result['report_diff']}", title: title }, onclick: 'tfm.configReportsModalDiff.showDiff(this);')
             end
      # diff is already HTML safe and should not be escaped again. Hence escape
      # the contents of message and concatenate it with diff and
      # declare it HTML safe.
      message.present? ? "#{h(message)} #{diff}".html_safe : diff # rubocop:disable Rails/OutputSafety
    end
  end
end
