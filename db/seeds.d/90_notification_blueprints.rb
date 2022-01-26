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
  },
  {
    :group => N_('Roles'),
    :name => 'Sync_roles_and_variables_successfully',
    :message => N_('Import roles and variables has finished successfully'),
    :level => 'success',
    :actions => {
      :links => [
        :path_method => :ansible_roles_path,
        :title => N_('Roles')
      ]
    }
  },
  {
    :group => N_('Roles'),
    :name => 'Sync_roles_and_variables_failed',
    :message => 'DYNAMIC',
    :level => 'error'
  },
  {
    :group => N_('Playbooks'),
    :name => 'Sync_playbooks_successfully',
    :message => N_('Import playbooks has finished successfully'),
    :level => 'success'

  },
  {
    :group => N_('Playbooks'),
    :name => 'Sync_playbooks_failed',
    :message => 'DYNAMIC',
    :level => 'error'
  }

]

blueprints.each { |blueprint| UINotifications::Seed.new(blueprint).configure }
