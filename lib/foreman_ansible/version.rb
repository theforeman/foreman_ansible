# frozen_string_literal: true

# Specify the version to be picked up in the foreman_ansible.gemspec
# This way other parts of Foreman can just call ForemanAnsible::VERSION
# and detect what version the plugin is running.
module ForemanAnsible
  VERSION = '10.4.0'
end
