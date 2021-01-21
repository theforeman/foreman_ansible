# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAnsible
  # Test how the inventory creator service transforms host params into
  # inventory variables and connection options
  class InventoryCreatorTest < ActiveSupport::TestCase
    setup do
      @host = FactoryBot.build(:host)
      @template_invocation = OpenStruct.new(
        :job_invocation => OpenStruct.new(:password => 'foobar',
                                          :effective_user_password => 'foobar'),
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
      Setting.expects(:[]).with('ansible_ssh_private_key_file').
        returns(nil).at_least_once
      Setting.expects(:[]).with('remote_execution_ssh_port').
        returns(2222).at_least_once
      Setting.expects(:[]).with('remote_execution_ssh_user').
        returns('root').at_least_once
      Setting.expects(:[]).with('ansible_winrm_server_cert_validation').
        returns(true).at_least_once
      Setting.expects(:[]).with('ansible_connection').
        returns('ssh').at_least_once
      Setting.expects(:[]).with('remote_execution_effective_user_method').
        returns('sudo').at_least_once
      @host.expects(:host_params).returns(extra_options).at_least_once
      @template_invocation.job_invocation.expects(:password).never
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
      assert_equal Setting['ansible_winrm_server_cert_validation'],
                   connection_params['ansible_winrm_server_cert_validation']
      assert_equal Setting['remote_execution_effective_user_method'],
                   connection_params['ansible_become_method']
      refute connection_params.key?('ansible_password')
      refute connection_params.key?('ansible_become_password')
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
      host.params.expects(:[]).with('remote_execution_effective_user_method').
        returns('sudo')
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
      job_invocation.expects(:password).never
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

    test 'parameters are passed as top-level "hostvars"' do
      @host.expects(:host_params).returns('hello' => 'foreman').at_least_once
      inventory = ForemanAnsible::InventoryCreator.new([@host],
                                                       @template_invocation)
      hostvar = inventory.to_hash['_meta']['hostvars'][@host.name]['hello']
      assert_equal 'foreman', hostvar
    end

    test 'ansible_roles are passed as top-level "hostvars"' do
      host = FactoryBot.create(:host)
      roles = [].tap do |array|
        2.times do |idx|
          role = FactoryBot.create(:ansible_role)
          FactoryBot.create(:host_ansible_role, :host_id => host.id, :ansible_role_id => role.id, :position => idx)
          array << role
        end
      end

      inventory = ForemanAnsible::InventoryCreator.new([host]).to_hash
      inventory_roles = inventory['_meta']['hostvars'][host.name]['foreman_ansible_roles']
      assert_equal 2, inventory_roles.count
      assert_includes inventory_roles, roles.first.name
    end

    test 'inventory can be generated without template invocation' do
      inventory = ForemanAnsible::InventoryCreator.new([@host]).to_hash
      assert_equal({}, inventory['all']['vars'])
      assert_equal(@host.name, inventory['all']['hosts'].first)
    end

    test 'ansible variables are passed as top-level "hostvars"' do
      role = FactoryBot.create :ansible_role
      variables = [].tap do |array|
        2.times do |num|
          array << FactoryBot.create(:ansible_variable,
                                     :ansible_role_id => role.id,
                                     :default_value => "value_#{num}",
                                     :override => true)
        end
      end

      host = FactoryBot.create(:host)
      FactoryBot.create(:host_ansible_role, :host_id => host.id, :ansible_role_id => role.id, :position => 0)

      inventory = ForemanAnsible::InventoryCreator.new([host]).to_hash
      host_inventory = inventory['_meta']['hostvars'][host.name]
      assert host_inventory[variables.first.key]
      assert host_inventory[variables.last.key]
    end

    test 'ansible variables are not passed in "foreman"' do
      role = FactoryBot.create :ansible_role
      variables = [].tap do |array|
        2.times do |num|
          array << FactoryBot.create(:ansible_variable,
                                     :ansible_role_id => role.id,
                                     :default_value => "value_#{num}",
                                     :override => true)
        end
      end

      host = FactoryBot.create(:host)
      FactoryBot.create(:host_ansible_role, :host_id => host.id, :ansible_role_id => role.id, :position => 0)

      inventory = ForemanAnsible::InventoryCreator.new([host]).to_hash
      inventory_roles = inventory['_meta']['hostvars'][host.name]['foreman']
      refute inventory_roles[variables.first.key]
      refute inventory_roles[variables.last.key]
    end

    test 'ansible variables can override host params' do
      role = FactoryBot.create :ansible_role
      FactoryBot.create(:ansible_variable,
                        :key => 'test_var',
                        :ansible_role_id => role.id,
                        :default_value => "variable value",
                        :override => true)
      host = FactoryBot.create(:host)
      FactoryBot.create(:host_ansible_role, :host_id => host.id, :ansible_role_id => role.id, :position => 0)
      host.expects(:host_params).returns('test_var' => 'param value').at_least_once
      inventory = ForemanAnsible::InventoryCreator.new([host]).to_hash
      assert_equal 'variable value', inventory['_meta']['hostvars'][host.name]['test_var']
    end

    test 'params from host info have correct nesting' do
      org = FactoryBot.create(:organization)
      host = FactoryBot.create(:host, :organization => org)
      inventory = ForemanAnsible::InventoryCreator.new([host]).to_hash
      assert_equal org.name, inventory['_meta']['hostvars'][host.name]['foreman']['organization']
    end
  end
end
