# frozen_string_literal: true

blueprints = [
  {
    :group => N_('Jobs'),
    :name => 'insights_remediation_successful',
    :message => N_('Insights remediation on %{hosts_count}' \
                   ' host(s) has finished successfully'),
    :level => 'success',
    :actions => {
      :links => [
        :path_method => :job_invocation_path,
        :title => N_('Job Details')
      ]
    }
  }
]

blueprints.each { |blueprint| UINotifications::Seed.new(blueprint).configure }
