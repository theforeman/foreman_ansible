require 'test_helper'

class PlaybookRunnerTest < ActiveSupport::TestCase
  context 'roles dir' do
    test 'reads default when none provided' do
      File.expects(:exist?).with('/etc/ansible').returns(true)
      runner = ForemanAnsibleCore::PlaybookRunner.new(nil, nil)
      assert '/etc/ansible', runner.instance_variable_get('@ansible_dir')
    end
  end

  context 'working_dir' do
    test 'creates temp one if not provided' do
      Dir.expects(:mktmpdir)
      File.expects(:exist?).with('/etc/ansible').returns(true)
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
end
