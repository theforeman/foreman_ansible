# frozen_string_literal: true

module ForemanAnsible
  # Imports playbooks from smart proxy
  class PlaybooksImporter
    include ::ForemanAnsible::ProxyAPI
    delegate :playbooks, :playbooks_names, :to => :proxy_api

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    def import_playbooks(playbooks_names)
      playbooks = playbooks(playbooks_names)
      result = { created: {}, updated: {} }
      playbooks.each do |playbook|
        parsed_playbook = parse_playbook playbook
        job_template_id = JobTemplate.where(name: parsed_playbook[:name]).pick(:id)
        if job_template_id.present?
          updated = update_job_template(job_template_id, parsed_playbook)
          result[:updated].merge!(updated) unless updated.nil?
        else
          result[:created].merge!(create_job_template(parsed_playbook))
        end
      end
      result
    end

    def parse_playbook(playbook)
      content = playbook['playbooks_content']
      {
        name: playbook['name'],
        playbook_content: metadata(playbook['name']) + content,
        vars: get_vars(content)
      }
    end

    def metadata(playbook_name)
      <<~END_HEREDOC
        <%#
          name: #{playbook_name}
          snippet: false
          job_category: Ansible Playbook - Imported
          provider_type: Ansible
          kind: job_template
          model: JobTemplate
        %>
      END_HEREDOC
    end

    def get_vars(playbook_content)
      YAML.safe_load(playbook_content).map { |play| play['vars'] }
    end

    def create_job_template(playbook)
      job_template = JobTemplate.create(name: playbook[:name], template: playbook[:playbook_content], job_category: 'Ansible Playbook - Imported', provider_type: 'Ansible')
      # TODO: Add support for creating template inputs
      job_template.organizations = Organization.unscoped.all
      job_template.locations = Location.unscoped.all
      job_template.save
      { job_template.id => job_template.name }
    end

    def update_job_template(job_template_id, playbook)
      # TODO: Add support for updating template inputs
      inputs = []
      job_template = JobTemplate.find(job_template_id)
      should_update = !playbook[:playbook_content].eql?(job_template.template)
      job_template.template = playbook[:playbook_content] if should_update
      { job_template.id => job_template.name } unless inputs.empty? && !should_update
    end
  end
end
