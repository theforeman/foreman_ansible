# frozen_string_literal: true

module ForemanAnsible
  module JobTemplateExtensions
    def self.prepended(base)
      base.attr_exportable :ansible_callback_enabled
    end

    def import_custom_data(options)
      super
      self.ansible_callback_enabled = @importing_metadata['ansible_callback_enabled'] if @importing_metadata.key?('ansible_callback_enabled')
    end
  end
end
