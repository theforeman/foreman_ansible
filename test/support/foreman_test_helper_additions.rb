require "#{ForemanAnsible::Engine.root}/test/support/fixture_support"
# loads the permissions for foreman_ansible and makes them available in tests
module AnsiblePermissionTestCase
  extend ActiveSupport::Concern

  included do
    extend ActiveRecord::TestFixtures

    new_fixture_path = Dir.mktmpdir("ansible_fixtures")
    self.fixture_path = new_fixture_path
    ForemanAnsible::PluginFixtures.add_fixtures(new_fixture_path)
    fixtures(:all)
    load_fixtures(ActiveRecord::Base)
  end
end

module ActiveSupport
  #:nodoc
  class TestCase
    include AnsiblePermissionTestCase
  end
end
