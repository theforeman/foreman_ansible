require 'test_plugin_helper'
require 'dynflow/testing'
Mocha::Mock.send :include, Dynflow::Testing::Mimic

# Ensure Hosts controller can CRUD ansible roles
class HostsControllerExtensionsTest < ActionController::TestCase
  tests ::HostsController

  context 'role assignment' do
    setup do
      @role = FactoryBot.create(:ansible_role)
    end

    test 'create a host with ansible roles' do
      host = { :name => 'foo',
               :managed => false,
               :ansible_role_ids => [@role.id] }
      post :create, :params => { :host => host }, :session => set_session_user
      assert_redirected_to host_url(assigns('host'))
      assert assigns('host').ansible_roles, [@role]
    end

    test 'update a host with ansible roles' do
      host = FactoryBot.create(:host, :managed => false)
      post :update,
           :params => {
             :id => host.id,
             :host => { :ansible_role_ids => [@role.id] }
           },
           :session => set_session_user
      assert_redirected_to host_url(assigns('host'))
      assert assigns('host').ansible_roles, [@role]
    end

    test 'delete a host with ansible roles' do
      host = FactoryBot.create(:host,
                               :managed => false,
                               :ansible_roles => [@role])
      assert_include @role.hosts, host
      delete :destroy,
             :params => { :id => host.id },
             :session => set_session_user
      assert_redirected_to hosts_url
      assert @role.hosts.empty?
    end
  end

  context 'playing roles' do
    setup do
      @host = FactoryBot.create(:host, :managed => false)
    end

    test 'redirect to task if successful' do
      load File.join(ForemanAnsible::Engine.root,
                     '/db/seeds.d/75_job_templates.rb')

      task_to_redirect = ForemanTasks::Task.new
      task_to_redirect.stubs(:persisted?).returns(true)
      task_to_redirect.stubs(:id).returns(1)
      # We don't actually want to run the job, so trigger juts returns true
      ::JobInvocationComposer.any_instance.expects(:trigger).returns(true)
      get :play_roles,
          :params => { :id => @host.id },
          :session => set_session_user
      assert_response :redirect
      assert_redirected_to(:controller => 'job_invocations',
                           :action => 'show',
                           :id => JobInvocation.last.id)
      assert flash['error'].empty?
    end

    test 'shows errors when not successful' do
      HostsController.any_instance.expects(:job_composer).
        raises(::Foreman::Exception.new('Oh foo'))
      get :play_roles,
          :params => { :id => @host.id },
          :session => set_session_user
      assert flash[:error].present?
      assert_redirected_to host_path(@host)
    end
  end
end
