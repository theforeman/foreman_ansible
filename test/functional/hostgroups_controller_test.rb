# frozen_string_literal: true

require 'test_plugin_helper'
require 'dynflow/testing'

Mocha::Mock.include Dynflow::Testing::Mimic

class HostgroupsControllerExtensionsTest < ActionController::TestCase
  tests ::HostgroupsController

  test 'runs roles on hosts in nested host groups' do
    load File.join(ForemanAnsible::Engine.root,
                   '/db/seeds.d/75_job_templates.rb')
    ::JobInvocationComposer.any_instance.expects(:trigger).returns(true)
    parent = FactoryBot.create(:hostgroup)
    child = FactoryBot.create(:hostgroup, :parent => parent)
    target = FactoryBot.create(:host, :hostgroup => child)

    get :play_roles,
        :params => { :id => parent.id },
        :session => set_session_user

    targeting = JobInvocation.last.targeting
    targeting.resolve_hosts!
    assert_equal [target.id], targeting.hosts.map(&:id)
    assert_redirected_to job_invocation_path(JobInvocation.last)
  end
end
