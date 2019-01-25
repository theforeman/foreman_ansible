# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAnsible
  # Test how the inventory creator service transforms host params into
  # inventory variables and connection options
  # rubocop:disable ClassLength
  class InventoryCreatorTest < ActiveSupport::TestCase
    setup do
      @host = FactoryBot.build(:host)
      @template_invocation = OpenStruct.new(
        :job_invocation => OpenStruct.new(:password => 'foobar'),
        :effective_user => 'foobar'
      )
    end

    test 'ansible_ parameters get turned into host variables' do
      extra_options = {
        'ansible_integer_option' => 1,
        'ansible_string_option' => '1',
        'ansible_boolean_option' => true,
        'ansible_user' => 'someone'
      }
      @host.expects(:host_params).returns(extra_options).at_least_once
      inventory = ForemanAnsible::InventoryCreator.new(@host,
                                                       @template_invocation)

      assert_empty extra_options.to_a - inventory.connection_params(@host).to_a
    end

    test 'settings are respected if param cannot be found' do
      AnsibleProvider.stubs(:find_ip_or_hostname).with(@host).returns(@host.name)
      extra_options = { 'ansible_user' => 'someone', 'ansible_port' => 2000 }
      Setting.expects(:[]).with('Enable_Smart_Variables_in_ENC').
        returns(nil).at_least_once
      Setting.expects(:[]).with('ansible_ssh_private_key_file').
        returns(nil).at_least_once
      Setting.expects(:[]).with('remote_execution_ssh_port').
        returns(2222).at_least_once
      Setting.expects(:[]).with('remote_execution_ssh_user').
        returns('root').at_least_once
      Setting.expects(:[]).with('remote_execution_ssh_password').
        returns('asafepassword').at_least_once
      Setting.expects(:[]).with('ansible_winrm_server_cert_validation').
        returns(true).at_least_once
      Setting.expects(:[]).with('ansible_connection').
        returns('ssh').at_least_once
      @host.expects(:host_params).returns(extra_options).at_least_once
      @template_invocation.job_invocation.expects(:password).
        returns(nil).at_least_once
      inventory = ForemanAnsible::InventoryCreator.new(@host,
                                                       @template_invocation)
      connection_params = inventory.connection_params(@host)
      assert_empty extra_options.to_a - inventory.connection_params(@host).to_a
      assert_equal true, connection_params['ansible_become']
      assert_equal @template_invocation.effective_user,
                   connection_params['ansible_become_user']
      assert_equal Setting['ansible_connection'],
                   connection_params['ansible_connection']
      refute_equal Setting['remote_execution_ssh_user'],
                   connection_params['ansible_user']
      assert_equal extra_options['ansible_user'],
                   connection_params['ansible_user']
      refute_equal Setting['remote_execution_ssh_port'],
                   connection_params['ansible_port']
      assert_equal ForemanRemoteExecutionCore.settings[:ssh_identity_key_file],
                   connection_params['ansible_ssh_private_key_file']
      assert_equal extra_options['ansible_port'],
                   connection_params['ansible_port']
      assert_equal Setting['remote_execution_ssh_password'],
                   connection_params['ansible_ssh_pass']
      assert_equal Setting['ansible_winrm_server_cert_validation'],
                   connection_params['ansible_winrm_server_cert_validation']
    end

    test 'job invocation ssh password is passed when available' do
      inventory = ForemanAnsible::InventoryCreator.new(@host,
                                                       @template_invocation)
      assert_equal(@template_invocation.job_invocation.password,
                   inventory.rex_ssh_password(@host))
    end

    test 'ssh private key is passed when available' do
      host = FactoryBot.build(:host)
      AnsibleProvider.stubs(:find_ip_or_hostname).with(host).returns(host.name)
      path_to_key = '/path/to/private/key'
      inventory = ForemanAnsible::InventoryCreator.new(host,
                                                       @template_invocation)
      host.params.expects(:[]).with('ansible_ssh_private_key_file').
        returns(path_to_key)
      host.params.expects(:[]).with('remote_execution_ssh_user').
        returns('root')
      host.params.expects(:[]).with('remote_execution_ssh_port').
        returns('2222')
      connection_params = inventory.connection_params(host)
      assert_equal path_to_key,
                   connection_params['ansible_ssh_private_key_file']
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
      job_invocation.expects(:password).returns(nil).at_least_once
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
        @template_invocation = OpenStruct.new(
          :job_invocation => OpenStruct.new(:password => 'foobar'),
          :input_values => []
        )
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
  # rubocop:enable ClassLength
end
