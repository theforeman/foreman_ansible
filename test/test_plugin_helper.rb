# frozen_string_literal: true

require 'test_helper'

def ansible_fixture_file(filename)
  File.join(
    ForemanAnsible::Engine.root, 'test', 'fixtures', filename
  )
end

def sample_facts_file
  File.read(
    ansible_fixture_file('sample_facts.json')
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
plugin_factories_path = File.join(__dir__, 'factories')
rex_factories_path = "#{ForemanRemoteExecution::Engine.root}/test/factories"
FactoryBot.definition_file_paths << rex_factories_path
FactoryBot.definition_file_paths << plugin_factories_path
FactoryBot.reload
