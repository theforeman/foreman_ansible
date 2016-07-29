require 'test_helper'
# unit tests for ProxyAPI::Ansible
class AnsibleTest < ActiveSupport::TestCase
  setup do
    @url = 'http://localhost:8443'
    @proxy_api = ProxyAPI::Ansible.new(:url => @url)
  end

  test 'should get ansible roles from proxy' do
    roles = ['some_role.some_author', 'test_role.test_author']
    @proxy_api.expects(:get).returns(fake_rest_client_response(roles))
    assert_equal roles, @proxy_api.roles
  end

  test 'should raise error with appropriate message' do
    message = 'Connection refused'
    @proxy_api.expects(:get).raises(Errno::ECONNREFUSED, message)
    err = assert_raises ProxyAPI::ProxyException do
      @proxy_api.roles
    end
    assert_match message, err.message
  end
end
