require 'test_helper'
require 'facets'

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

def assert_job_invocation_is_ok(response, targets)
  as_admin do
    targeting = JobInvocation.find(response['id']).targeting
    targeting.resolve_hosts!
    assert_equal [targets].flatten.sort, targeting.hosts.map(&:id).sort
  end
  assert_equal 'Ansible Playbook', response['job_category']
  assert_response :created
end
plugin_factories_path = File.join(File.dirname(__FILE__), 'factories')
FactoryBot.definition_file_paths << plugin_factories_path
FactoryBot.reload
