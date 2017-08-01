require 'test_plugin_helper'

module ForemanAnsible
  # Test how the inventory creator service transforms host params into
  # inventory variables and connection options
  class InventoryCreatorTest < ActiveSupport::TestCase
    setup do
      @host = FactoryGirl.build(:host)
    end

    test 'ansible_ parameters get turned into host variables' do
      extra_options = {
        'ansible_integer_option' => 1,
        'ansible_string_option' => '1',
        'ansible_boolean_option' => true,
        'ansible_user' => 'someone'
      }
      @host.expects(:host_params).returns(extra_options).at_least_once
      inventory = ForemanAnsible::InventoryCreator.new(@host)

      assert_empty extra_options.to_a - inventory.connection_params(@host).to_a
    end

    test 'settings are respected if param cannot be found' do
      extra_options = { 'ansible_user' => 'someone', 'ansible_port' => 2000 }
      Setting.expects(:[]).with('ansible_become').returns(nil).at_least_once
      Setting.expects(:[]).with('ansible_ssh_private_key_file').
        returns(nil).at_least_once
      Setting.expects(:[]).with('ansible_port').returns(nil).at_least_once
      Setting.expects(:[]).with('ansible_user').returns(nil).at_least_once
      Setting.expects(:[]).with('ansible_ssh_pass').
        returns('asafepassword').at_least_once
      Setting.expects(:[]).with('ansible_winrm_server_cert_validation').
        returns(true).at_least_once
      Setting.expects(:[]).with('ansible_connection').
        returns('ssh').at_least_once
      @host.expects(:host_params).returns(extra_options).at_least_once
      inventory = ForemanAnsible::InventoryCreator.new(@host)
      connection_params = inventory.connection_params(@host)
      assert_empty extra_options.to_a - inventory.connection_params(@host).to_a
      assert_equal Setting['ansible_connection'],
                   connection_params['ansible_connection']
      assert_equal Setting['ansible_ssh_pass'],
                   connection_params['ansible_ssh_pass']
      assert_equal Setting['ansible_winrm_server_cert_validation'],
                   connection_params['ansible_winrm_server_cert_validation']
    end
  end
end
