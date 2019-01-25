# frozen_string_literal: true
require 'test_plugin_helper'

module ForemanAnsible
  # Checks sample Ansible facts to see if it can assign them to
  # Host properties
  class FactParserTest < ActiveSupport::TestCase
    setup do
      @facts_parser = ForemanAnsible::FactParser.new(facts_json)
    end

    test 'finds facter domain even if ansible_domain is empty' do
      expect_where(Domain, @facts_parser.facts[:facter_domain])
      @facts_parser.domain
    end

    test 'finds model' do
      expect_where(Model, @facts_parser.facts[:ansible_product_name])
      @facts_parser.model
    end

    test 'finds architecture' do
      expect_where(Architecture, @facts_parser.facts[:ansible_architecture])
      @facts_parser.architecture
    end

    test 'does not set environment' do
      refute @facts_parser.environment
    end

    test 'creates operatingsystem from operating system options' do
      sample_mock = mock
      major_fact = @facts_parser.facts['ansible_distribution_major_version']
      _, minor_fact = @facts_parser.
                      facts['ansible_distribution_version'].split('.')
      Operatingsystem.expects(:where).
        with(:name => @facts_parser.facts['ansible_distribution'],
             :major => major_fact, :minor => minor_fact || '').
        returns(sample_mock)
      sample_mock.expects(:first)
      @facts_parser.operatingsystem
    end

    test 'does not fail if facts are not enough to create OS' do
      @facts_parser.expects(:os_name).returns('fakeos').at_least_once
      @facts_parser.expects(:os_major).returns('').at_least_once
      @facts_parser.expects(:os_minor).returns('').at_least_once
      @facts_parser.expects(:os_description).returns('').at_least_once
      Operatingsystem.any_instance.expects(:valid?).returns(false)
      assert_nil @facts_parser.operatingsystem
    end

    private

    def expect_where(model, fact_name)
      sample_mock = mock
      model.expects(:where).
        with(:name => fact_name).
        returns(sample_mock)
      sample_mock.expects(:first_or_create)
    end
  end

  # Tests for Network parser
  class NetworkFactParserTest < ActiveSupport::TestCase
    setup do
      @facts_parser = ForemanAnsible::FactParser.new(
        HashWithIndifferentAccess.new(
          '_type' => 'ansible',
          '_timestamp' => '2018-10-29 20:01:51 +0100',
          'ansible_facts' =>
          {
            'ansible_interfaces' => [
                'eth0'
            ],
            'ansible_eth0' => {
              'active' => true,
              'device' => 'eth0',
              "macaddress" => '52:54:00:04:55:37',
              'ipv4' => {
                  'address' => '10.10.0.10',
                  'netmask' => '255.255.0.0',
                  'network' => '10.10.0.0'
              },
              'ipv6' => [
                  {
                      'address' => 'fd00::5054:00ff:fe04:5537',
                      'prefix' => '64',
                      'scope' => 'host'
                  }
              ],
              'mtu' => 1500,
              'promisc' => false,
              'type' => 'ether'
            }
          }
        )
      )
    end

    test 'Parses IPv4 & IPv6 addresses correctly' do
      iut = 'eth0'.dup
      interface = @facts_parser.get_facts_for_interface(iut)
      assert_equal '10.10.0.10', interface['ipaddress']
      assert_equal 'fd00::5054:00ff:fe04:5537', interface['ipaddress6']
    end
  end

  # Tests for Debian parser
  class DebianFactParserTest < ActiveSupport::TestCase
    setup do
      @facts_parser = ForemanAnsible::FactParser.new(
        HashWithIndifferentAccess.new(
          '_type' => 'ansible',
          '_timestamp' => '2015-10-29 20:01:51 +0100',
          'ansible_facts' =>
          {
            'ansible_distribution_major_version' => 'buster/sid',
            'ansible_distribution' => 'Debian'
          }
        )
      )
    end

    test 'Parses debian unstable aka sid correctly' do
      as_admin do
        os = @facts_parser.operatingsystem

        assert_equal '10', os.major
        assert_equal 'Debian', os.name
      end
    end
  end

  # Tests for Windows parser
  class WindowsFactParserTest < ActiveSupport::TestCase
    context 'Windows 7' do
      setup do
        @facts_parser = ForemanAnsible::FactParser.new(
          HashWithIndifferentAccess.new(
            '_type' => 'ansible',
            '_timestamp' => '2015-10-29 20:01:51 +0100',
            'ansible_facts' => {
              'ansible_architecture' => '32-Bit',
              'ansible_distribution' => 'Microsoft Windows 7 Enterprise ',
              'ansible_distribution_major_version' => '6',
              'ansible_distribution_version' => '6.1.7601.65536',
              'ansible_os_family' => 'Windows',
              'ansible_os_name' => 'Microsoft Windows 7 Enterprise',
              'ansible_product_name' => 'DS61',
              'ansible_product_serial' => 'To be filled by O.E.M.',
              'ansible_system' => 'Win32NT',
              'ansible_win_rm_certificate_expires' => '2021-01-23 15:08:48',
              'ansible_windows_domain' => 'example.com'
            }
          )
        )
      end

      test 'parses Windows 7 Enterprise correctly' do
        os = @facts_parser.operatingsystem
        assert_equal '6', os.major
        assert_equal '6.1.760165536', os.release
        assert_equal '1.760165536', os.minor
        assert_equal 'Windows', os.family
        assert_equal 'Microsoft Windows 7 Enterprise', os.description
        assert_equal 'MicrosoftWindows7Enterprise', os.name
        assert os.valid?
      end
    end

    context 'Windows Server 2016' do
      setup do
        @facts_parser = ForemanAnsible::FactParser.new(
          HashWithIndifferentAccess.new(
            '_type' => 'ansible',
            '_timestamp' => '2015-10-29 20:01:51 +0100',
            'ansible_facts' => {
              'ansible_architecture' => '64-Bit',
              'ansible_distribution' => 'Microsoft Windows Server 2016 '\
                                        'Standard',
              'ansible_distribution_major_version' => '10',
              'ansible_distribution_version' => '10.0.14393.0',
              'ansible_os_family' => 'Windows',
              'ansible_os_name' => 'Microsoft Windows Server 2016 Standard',
              'ansible_system' => 'Win32NT',
              'ansible_win_rm_certificate_expires' => '2021-01-23 15:08:48',
              'ansible_windows_domain' => 'example.com'
            }
          )
        )
      end

      test 'parses Windows Server correctly' do
        os = @facts_parser.operatingsystem
        assert_equal '10', os.major
        assert_equal '10.0.143930', os.release
        assert_equal '0.143930', os.minor
        assert_equal 'Windows', os.family
        assert_equal 'Microsoft Windows Server 2016 Standard', os.description
        assert_equal 'MicrosoftWindowsServer2016Standard', os.name
        assert os.valid?
      end
    end
  end
end
