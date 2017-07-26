require 'test_plugin_helper'

# Tests for the Proxy Selector service
class ProxySelectorTest < ActiveSupport::TestCase
  setup do
    @host = FactoryGirl.create(:host)
  end

  test 'reuses proxies already assigned to host' do
    mocked_scope = mock
    mocked_scope.expects(:with_features).with('Ansible').returns('foo')
    @host.expects(:smart_proxies).returns(mocked_scope)
    proxy_selector = ForemanAnsible::ProxySelector.new
    assert_equal 'foo',
                 proxy_selector.available_proxies(@host)[:fallback]
  end

  test 'only finds proxies that are within host taxonomies' do
    @host.organization = taxonomies(:organization1)
    @ansible_proxy = FactoryGirl.create(:smart_proxy, :with_ansible,
                                        :organizations => [@host.organization])
    # Unreachable proxy, because of the organizations mismatch with Host
    FactoryGirl.create(:smart_proxy, :with_ansible, :organizations => [])
    proxy_selector = ForemanAnsible::ProxySelector.new
    setup_user('view', 'smart_proxies')
    assert_equal [@ansible_proxy],
                 proxy_selector.available_proxies(@host)[:global]
  end
end
