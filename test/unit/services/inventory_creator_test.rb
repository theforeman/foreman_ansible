require 'test_plugin_helper'

module ForemanAnsible
  # Test how the inventory creator service transforms host params into
  # inventory variables and connection options
  class InventoryCreatorTest < ActiveSupport::TestCase
    setup do
      @host = FactoryBot.build(:host)
    end

    test 'ansible_ parameters get turned into host variables' do
      extra_options = {
        'ansible_integer_option' => 1,
        'ansible_string_option' => '1',
        'ansible_boolean_option' => true,
        'ansible_user' => 'someone'
      }
      @host.expects(:host_params).returns(extra_options).at_least_once
      inventory = ForemanAnsible::InventoryCreator.new(@host, nil)

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
      inventory = ForemanAnsible::InventoryCreator.new(@host, nil)
      connection_params = inventory.connection_params(@host)
      assert_empty extra_options.to_a - inventory.connection_params(@host).to_a
      assert_equal Setting['ansible_connection'],
                   connection_params['ansible_connection']
      assert_equal Setting['ansible_ssh_pass'],
                   connection_params['ansible_ssh_pass']
      assert_equal Setting['ansible_winrm_server_cert_validation'],
                   connection_params['ansible_winrm_server_cert_validation']
    end

    test 'template invocation inputs are sent as Ansible variables' do
      job_template = FactoryBot.build(
        :job_template,
        :template => 'service restart {{service_name}}'
      )
      job_invocation = FactoryBot.create(:job_invocation)
      job_template.template_inputs << FactoryBot.build(:template_input,
                                                       :name => 'service_name',
                                                       :input_type => 'user',
                                                       :required => true)
      template_invocation = FactoryBot.build(:template_invocation,
                                             :template => job_template,
                                             :job_invocation => job_invocation)
      input_value = FactoryBot.create(
        :template_invocation_input_value,
        :template_invocation => template_invocation,
        :template_input => job_template.template_inputs.first,
        :value => 'foreman'
      )
      template_invocation.input_values << input_value
      inventory = ForemanAnsible::InventoryCreator.new([@host],
                                                       template_invocation)
      assert_equal({ 'service_name' => 'foreman' },
                   inventory.to_hash['all']['vars'])
    end

    context 'top-level parameters sent as variables' do
      setup do
        # Fetching the Host parameters requires this Setting, since
        # this plugin does not provide fixtures
        Setting.create(:name => 'top_level_ansible_vars',
                       :description => 'sample description',
                       :default => true)
        @template_invocation = OpenStruct.new(:input_values => [])
      end

      test 'parameters are passed as top-level "hostvars" by default' do
        @host.expects(:host_params).returns('hello' => 'foreman').at_least_once
        inventory = ForemanAnsible::InventoryCreator.new([@host],
                                                         @template_invocation)
        hostvar = inventory.to_hash['_meta']['hostvars'][@host.name]['hello']
        assert_equal 'foreman', hostvar
      end

      test 'parameters NOT passed as top-level "hostvars" if false' do
        Setting['top_level_ansible_vars'] = false
        @host.expects(:host_params).returns('hello' => 'foreman').at_least_once
        inventory = ForemanAnsible::InventoryCreator.new([@host],
                                                         @template_invocation)
        hostvar = inventory.to_hash['_meta']['hostvars'][@host.name]['hello']
        refute_equal 'foreman', hostvar
      end
    end
  end
end
