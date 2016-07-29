require 'test_plugin_helper'

# Ensure Hosts controller can CRUD ansible roles
class HostsControllerExtensionsTest < ActionController::TestCase
  tests ::HostsController

  setup do
    @role = FactoryGirl.create(:ansible_role)
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
    host = FactoryGirl.create(:host, :managed => false)
    post :update, { :id => host.id,
                    :host => { :ansible_role_ids => [@role.id] } },
         set_session_user
    assert_redirected_to host_url(assigns('host'))
    assert assigns('host').ansible_roles, [@role]
  end

  test 'delete a host with ansible roles' do
    host = FactoryGirl.create(:host,
                              :managed => false,
                              :ansible_roles => [@role])
    assert_include @role.hosts, host
    delete :destroy, { :id => host.id }, set_session_user
    assert_redirected_to hosts_url
    assert @role.hosts.empty?
  end
end
