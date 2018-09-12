# frozen_string_literal: true

# Rename ansible job categories migration
class RenameAnsibleJobCategories < ActiveRecord::Migration[5.1]
  def up
    unless User.unscoped.find_by(:login => User::ANONYMOUS_ADMIN)
      STDOUT.puts 'No ANONYMOUS_ADMIN found. Skipping renaming Ansible jobs'
      return
    end
    User.as_anonymous_admin do
      updated_templates = ['Power Action - Ansible Default',
                           'Puppet Run Once - Ansible Default']
      JobTemplate.without_auditing do
        job_templates = JobTemplate.where(
          :name => updated_templates
        ).all
        job_templates.each do |job_template|
          next if job_template.job_category =~ /^Ansible/
          job_template.job_category = "Ansible #{job_template.job_category}"
          job_template.save
        end

        service_template = JobTemplate.where(
          :name => 'Service Action - Ansible Default'
        ).first
        if service_template.present?
          service_template.job_category = 'Ansible Services'
          service_template.save_without_auditing
        end
      end
    end
  end
end
