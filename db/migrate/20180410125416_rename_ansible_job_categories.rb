class RenameAnsibleJobCategories < ActiveRecord::Migration[5.1]
  def up
    unless User.unscoped.find_by_login(User::ANONYMOUS_ADMIN)
      puts "No ANONYMOUS_ADMIN found. Skipping renaming Ansible jobs"
      return
    end
    User.as_anonymous_admin do
      updated_templates = ['Power Action - Ansible Default',
                           'Puppet Run Once - Ansible Default']
      JobTemplate.where(:name => updated_templates).all.each do |job_template|
        next if job_template.job_category =~ /^Ansible/
        job_template.job_category = "Ansible #{job_template.job_category}"
        job_template.save!
      end

      if service_template = JobTemplate.where(:name => 'Service Action - Ansible Default').first
        service_template.job_category = 'Ansible Services'
        service_template.save!
      end
    end
  end
end
