require 'test_helper'

def sample_facts_file
  File.read(
    File.join(
      ForemanAnsible::Engine.root, 'test', 'fixtures', 'sample_facts.json'
    )
  )
end

def facts_json
  HashWithIndifferentAccess.new(JSON.parse(sample_facts_file))
end

plugin_factories_path = File.join(File.dirname(__FILE__), 'factories')
FactoryGirl.definition_file_paths << plugin_factories_path
FactoryGirl.reload
