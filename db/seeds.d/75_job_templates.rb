# frozen_string_literal: true

organizations = Organization.unscoped.all
locations = Location.unscoped.all

template_files = Dir[File.join("#{ForemanAnsible::Engine.root}/app/views/foreman_ansible/job_templates/**/*.erb")]

unsupported_templates = {
  'Smart Proxy Upgrade Playbook': 'smart_proxy_upgrade_-_ansible_default.erb',
  'Capsule Upgrade Playbook': 'capsule_upgrade_-_ansible_default.erb',
  'Upgrade orcharhino Proxy - Ansible Default': 'orcharhino_proxy_upgrade_-_ansible_default.erb',
}

if Foreman::Plugin.find('foreman_theme_satellite').present?
  unsupported_templates.delete(:'Capsule Upgrade Playbook')
elsif Foreman::Plugin.find('orcharhino_core').present?
  unsupported_templates.delete(:'orcharhino Proxy Upgrade Playbook')
else
  unsupported_templates.delete(:'Smart Proxy Upgrade Playbook')
end


User.as_anonymous_admin do
  RemoteExecutionFeature.without_auditing do
    if Rails.env.test? || Foreman.in_rake?
      # If this file tries to import a template with a REX feature in a SeedsTest,
      # it will fail - the REX feature isn't registered on SeedsTest because
      # DatabaseCleaner truncates the db before every test.
      # During db:seed, we also want to know the feature is registered before
      # seeding the template
      ForemanAnsible::Engine.register_rex_feature
    end
    JobTemplate.without_auditing do
      template_files.reject { |template| unsupported_templates.value?(File.basename(template)) }.each do |template|
        sync = !Rails.env.test? && Setting[:remote_execution_sync_templates]
        template = JobTemplate.import_raw!(File.read(template),
                                           :default => true,
                                           :lock => true,
                                           :update => sync)
        template.organizations = organizations if template.present?
        template.locations = locations if template.present?
      end

      unsupported_templates_in_db = JobTemplate.where(name: unsupported_templates.keys)

      if unsupported_templates_in_db.any?
        unsupported_templates_in_db.update_all(locked: false)
        unsupported_templates_in_db.destroy_all
      end
    end
  end
end
