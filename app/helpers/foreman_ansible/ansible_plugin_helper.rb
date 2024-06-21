# frozen_string_literal: true

require "#{ForemanAnsible::Engine.root}/lib/foreman_ansible/version"

module ForemanAnsible
  # General helper for foreman_ansible
  module AnsiblePluginHelper
    def ansible_doc_url
      'https://docs.theforeman.org/nightly/Managing_Configurations_Ansible/index-foreman-el.html'
    end
  end
end
