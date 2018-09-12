# frozen_string_literal: true

require "#{ForemanAnsible::Engine.root}/lib/foreman_ansible/version"

module ForemanAnsible
  # General helper for foreman_ansible
  module AnsiblePluginHelper
    def ansible_doc_url
      major_version = ::ForemanAnsible::VERSION.split('.')[0]
      'https://theforeman.org/plugins/foreman_ansible/'\
        "#{major_version}.x/index.html"
    end
  end
end
