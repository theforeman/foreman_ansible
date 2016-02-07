module ForemanAnsible
  # This module takes the config reports stored in Foreman for Ansible and
  # modifies them to be properly presented in views
  module AnsibleReportsHelper
    def module_name(log)
      JSON.parse(log.source.value)['module_name']
    end

    def module_args(log)
      JSON.parse(log.source.value)['module_args']
    end

    def ansible_module_message(log)
      paragraph_style = 'margin:0px;font-family:Menlo,Monaco,Consolas,monospace'
      JSON.parse(log.message.value).except('invocation').map do |name, value|
        next if value.blank?
        "<p style=#{paragraph_style}>#{name}: #{value}</p>"
      end.join.html_safe
    end

    def ansible_report?(log)
      module_name(log).present?
    rescue # Failures when parsing the log indicates it's not an Ansible report
      false
    end
  end
end
