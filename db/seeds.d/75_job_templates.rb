# frozen_string_literal: true

organizations = Organization.unscoped.all
locations = Location.unscoped.all
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
      Dir[File.join("#{ForemanAnsible::Engine.root}/app/views/foreman_ansible/"\
                    'job_templates/**/*.erb')].each do |template|
        sync = !Rails.env.test? && Setting[:remote_execution_sync_templates]
        template = JobTemplate.import_raw!(File.read(template),
                                           :default => true,
                                           :lock => true,
                                           :update => sync)
        template.organizations = organizations if template.present?
        template.locations = locations if template.present?
      end
    end
  end
end
