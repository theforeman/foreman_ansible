require 'test_plugin_helper'

# Tests for the Roles Reader service of ansible core,
# this class simply reads roles from its path in ansible.cfg
class RolesReaderTest < ActiveSupport::TestCase
  CONFIG_PATH = '/etc/ansible/ansible.cfg'.freeze
  ROLES_PATH = '/etc/ansible/roles'.freeze

  describe '#roles_path' do
    test 'detects commented roles_path' do
      expect_content_config ['#roles_path = thisiscommented!']
      assert_equal(ROLES_PATH,
                   ForemanAnsibleCore::RolesReader.roles_path(CONFIG_PATH))
    end

    test 'returns default path if no roles_path defined' do
      expect_content_config ['norolepath!']
      assert_equal(ROLES_PATH,
                   ForemanAnsibleCore::RolesReader.roles_path(CONFIG_PATH))
    end

    test 'returns roles_path if one is defined' do
      expect_content_config ['roles_path = /mycustom/ansibleroles/path']
      assert_equal('/mycustom/ansibleroles/path',
                   ForemanAnsibleCore::RolesReader.roles_path(CONFIG_PATH))
    end
  end

  describe '#list_roles' do
    setup do
      # Return a path without actually reading the config file to make tests
      # pass even on hosts without Ansible installed
      ForemanAnsibleCore::RolesReader.stubs(:roles_path).
        returns('/etc/ansible/roles')
    end

    test 'handles "No such file or dir" with exception' do
      Dir.expects(:glob).with("#{ROLES_PATH}/*").raises(Errno::ENOENT)
      ex = assert_raises(ForemanAnsibleCore::ReadConfigFileException) do
        ForemanAnsibleCore::RolesReader.list_roles
      end
      assert_match(/Could not read Ansible config file/, ex.message)
    end

    test 'raises error if the roles path is not readable' do
      Dir.expects(:glob).with("#{ROLES_PATH}/*").raises(Errno::EACCES)
      ex = assert_raises(ForemanAnsibleCore::ReadConfigFileException) do
        ForemanAnsibleCore::RolesReader.list_roles
      end
      assert_match(/Could not read Ansible config file/, ex.message)
    end
  end

  private

  def expect_content_config(ansible_cfg_content)
    File.expects(:readlines).with(CONFIG_PATH).returns(ansible_cfg_content)
  end
end
