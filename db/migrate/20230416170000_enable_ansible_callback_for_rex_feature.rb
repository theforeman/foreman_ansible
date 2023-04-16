class EnableAnsibleCallbackForRexFeature < ActiveRecord::Migration[6.0]
  def change
    Template.where(id: RemoteExecutionFeature.select(:job_template_id).where(label: 'ansible_run_host')).update_all(ansible_callback_enabled: true)
  end
end
