# frozen_string_literal: true

require 'test_plugin_helper'

class JobTemplateExtensionsTest < ActiveSupport::TestCase
  describe 'Ansible callback metadata' do
    let(:template_metadata) do
      <<~ERB
        <%#
        name: Ansible Roles - Ansible Default
        ansible_callback_enabled: true
        model: JobTemplate
        %>

        ---
        - hosts: all
      ERB
    end

    it 'exports ansible_callback_enabled' do
      template = JobTemplate.new(:ansible_callback_enabled => true)

      assert(template.to_export['ansible_callback_enabled'])
    end

    it 'imports ansible_callback_enabled from template metadata' do
      template = JobTemplate.new

      template.import_without_save(template_metadata)

      assert(template.ansible_callback_enabled)
    end

    it 'does not reset ansible_callback_enabled when metadata omits it' do
      template = JobTemplate.new(:ansible_callback_enabled => true)

      template.import_without_save("<%#\nname: Job template\nmodel: JobTemplate\n%>\n\n---")

      assert(template.ansible_callback_enabled)
    end
  end
end
