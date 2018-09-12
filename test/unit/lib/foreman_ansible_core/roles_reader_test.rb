# frozen_string_literal: true

require 'test_plugin_helper'

# Tests for the Roles Reader service of ansible core,
# this class simply reads roles from its path in ansible.cfg
class RolesReaderTest < ActiveSupport::TestCase
  CONFIG_PATH = '/etc/ansible/ansible.cfg'
  ROLES_PATH = '/etc/ansible/roles'

  describe '#roles_path' do
    test 'detects commented roles_path' do
      expect_content_config ['#roles_path = thisiscommented!']
      assert_equal(ROLES_PATH,
                   ForemanAnsibleCore::RolesReader.roles_path)
    end

    test 'returns default path if no roles_path defined' do
      expect_content_config ['norolepath!']
      assert_equal(ROLES_PATH,
                   ForemanAnsibleCore::RolesReader.roles_path)
    end

    test 'returns roles_path if one is defined' do
      expect_content_config ['roles_path = /mycustom/ansibleroles/path']
      assert_equal('/mycustom/ansibleroles/path',
                   ForemanAnsibleCore::RolesReader.roles_path)
    end
  end

  describe '#list_roles' do
    test 'reads roles from paths' do
      expect_content_config ["roles_path = #{ROLES_PATH}"]
      ForemanAnsibleCore::RolesReader.expects(:read_roles).with(ROLES_PATH)
      ForemanAnsibleCore::RolesReader.list_roles
    end

    test 'reads roles from paths' do
      roles_paths = ['/mycustom/roles/path', '/another/path']
      roles_paths.each do |path|
        ForemanAnsibleCore::RolesReader.expects(:read_roles).with(path)
      end
      expect_content_config ["roles_path = #{roles_paths.join(':')}"]
      ForemanAnsibleCore::RolesReader.list_roles
    end

    context 'with unreadable roles path' do
      setup do
        expect_content_config ["roles_path = #{ROLES_PATH}"]
      end

      test 'handles "No such file or dir" with exception' do
        Dir.expects(:glob).with("#{ROLES_PATH}/*").raises(Errno::ENOENT)
        ex = assert_raises(ForemanAnsibleCore::ReadRolesException) do
          ForemanAnsibleCore::RolesReader.list_roles
        end
        assert_match(/Could not read Ansible roles/, ex.message)
      end

      test 'raises error if the roles path is not readable' do
        Dir.expects(:glob).with("#{ROLES_PATH}/*").raises(Errno::EACCES)
        ex = assert_raises(ForemanAnsibleCore::ReadRolesException) do
          ForemanAnsibleCore::RolesReader.list_roles
        end
        assert_match(/Could not read Ansible roles/, ex.message)
      end
    end

    context 'with unreadable config' do
      test 'handles "No such file or dir" with exception' do
        File.expects(:readlines).with(CONFIG_PATH).raises(Errno::ENOENT)
        ex = assert_raises(ForemanAnsibleCore::ReadConfigFileException) do
          ForemanAnsibleCore::RolesReader.list_roles
        end
        assert_match(/Could not read Ansible config file/, ex.message)
      end

      test 'raises error if the roles path is not readable' do
        File.expects(:readlines).with(CONFIG_PATH).raises(Errno::EACCES)
        ex = assert_raises(ForemanAnsibleCore::ReadConfigFileException) do
          ForemanAnsibleCore::RolesReader.list_roles
        end
        assert_match(/Could not read Ansible config file/, ex.message)
      end
    end
  end

  private

  def expect_content_config(ansible_cfg_content)
    ForemanAnsibleCore::RolesReader.expects(:roles_path_from_config).
      returns(ansible_cfg_content)
  end
end
