require 'test_plugin_helper'
require 'dynflow/testing'
Mocha::Mock.send :include, Dynflow::Testing::Mimic
require 'support/foreman_tasks/task'

# Ensure Hosts controller can CRUD ansible roles
class HostsControllerExtensionsTest < ActionController::TestCase
  include Support::ForemanTasks::Task

  tests ::HostsController

  context 'role assignment' do
    setup do
      @role = FactoryBot.create(:ansible_role)
    end

    test 'create a host with ansible roles' do
      host = { :name => 'foo',
               :managed => false,
               :ansible_role_ids => [@role.id] }
      post :create, { :host => host }, set_session_user
      assert_redirected_to host_url(assigns('host'))
      assert assigns('host').ansible_roles, [@role]
    end

    test 'update a host with ansible roles' do
      host = FactoryBot.create(:host, :managed => false)
      post :update, { :id => host.id,
                      :host => { :ansible_role_ids => [@role.id] } },
           set_session_user
      assert_redirected_to host_url(assigns('host'))
      assert assigns('host').ansible_roles, [@role]
    end

    test 'delete a host with ansible roles' do
      host = FactoryBot.create(:host,
                               :managed => false,
                               :ansible_roles => [@role])
      assert_include @role.hosts, host
      delete :destroy, { :id => host.id }, set_session_user
      assert_redirected_to hosts_url
      assert @role.hosts.empty?
    end
  end

  context 'playing roles' do
    setup do
      @host = FactoryBot.create(:host, :managed => false)
    end

    test 'redirect to task if successful' do
      task_stub = new_task_stub(@host)
      task_to_redirect = ForemanTasks::Task.new
      task_stub.stubs(:to_model).returns(task_to_redirect)
      task_to_redirect.stubs(:persisted?).returns(true)
      task_to_redirect.stubs(:id).returns(1)
      get :play_roles, { :id => @host.id }, set_session_user
    end

    test 'shows errors when not successful' do
      HostsController.any_instance.expects(:async_task).
        raises(::Foreman::Exception.new('Oh foo'))
      get :play_roles, { :id => @host.id }, set_session_user
      assert flash[:error].present?
      assert_redirected_to host_path(@host)
    end
  end

  private

  def new_task_stub(host)
    assert_async_task(::Actions::ForemanAnsible::PlayHostRoles,
                      host) do |action_host|
      assert_equal host, action_host
    end
  end
end
