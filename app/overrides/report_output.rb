# frozen_string_literal: true

Deface::Override.new(
  :virtual_path => 'config_reports/_output',
  :name => 'report_output',
  :surround => '#report_log',
  :partial => 'foreman_ansible/config_reports/output'
)
