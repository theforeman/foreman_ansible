require 'test_helper'

# Playbook Runner - this class uses foreman_tasks_core
# to run playbooks
class PlaybookRunnerTest < ActiveSupport::TestCase
  context 'roles dir' do
    test 'reads default when none provided' do
      ForemanAnsibleCore::PlaybookRunner.any_instance.stubs(:unknown_hosts).
        returns([])
      File.expects(:exist?).with(Dir.home).returns(true)
      runner = ForemanAnsibleCore::PlaybookRunner.new(nil, nil)
      assert '/etc/ansible', runner.instance_variable_get('@ansible_dir')
    end
  end

  context 'working_dir' do
    setup do
      ForemanAnsibleCore::PlaybookRunner.any_instance.stubs(:unknown_hosts).
        returns([])
    end

    test 'creates temp one if not provided' do
      Dir.expects(:mktmpdir)
      File.expects(:exist?).with(Dir.home).returns(true)
      ForemanAnsibleCore::PlaybookRunner.new(nil, nil)
    end

    test 'reads it when provided' do
      settings = { :working_dir => '/foo', :ansible_dir => '/etc/foo' }
      ForemanAnsibleCore.expects(:settings).returns(settings)
      File.expects(:exist?).with(settings[:ansible_dir]).returns(true)
      Dir.expects(:mktmpdir).never
      runner = ForemanAnsibleCore::PlaybookRunner.new(nil, nil)
      assert '/foo', runner.instance_variable_get('@working_dir')
    end
  end

  context 'TOFU policy' do # Trust On First Use
    setup do
      @inventory = { 'all' => { 'hosts' => ['foreman.example.com'] } }.to_json
      @output = StringIO.new
      logger = Logger.new(@output)
      ForemanAnsibleCore::PlaybookRunner.any_instance.stubs(:logger).
        returns(logger)
    end

    test 'ignores known hosts' do
      Net::SSH::KnownHosts.expects(:search_for).
        with('foreman.example.com').returns(['somekey'])
      ForemanAnsibleCore::PlaybookRunner.any_instance.
        expects(:add_to_known_hosts).never
      ForemanAnsibleCore::PlaybookRunner.new(@inventory, nil)
    end

    test 'adds unknown hosts to known_hosts' do
      Net::SSH::KnownHosts.expects(:search_for).
        with('foreman.example.com').returns([])
      ForemanAnsibleCore::PlaybookRunner.any_instance.
        expects(:add_to_known_hosts).with('foreman.example.com')
      ForemanAnsibleCore::PlaybookRunner.new(@inventory, nil)
    end

    test 'logs error when it cannot add to known_hosts' do
      Net::SSH::KnownHosts.expects(:search_for).
        with('foreman.example.com').returns([])
      Net::SSH::Transport::Session.expects(:new).with('foreman.example.com').
        raises(Net::Error)
      ForemanAnsibleCore::PlaybookRunner.new(@inventory, nil)
      assert_match(
        /ERROR.*Failed to save host key for foreman.example.com: Net::Error/,
        @output.string
      )
    end
  end
end
