# frozen_string_literal: true

require 'test_helper'

class CommandCreatorTest < ActiveSupport::TestCase
  let(:inventory_file) { 'test_inventory' }
  let(:playbook_file) { 'test_palybook.yml' }
  subject do
    ForemanAnsibleCore::CommandCreator.new(inventory_file, playbook_file, {})
  end

  test 'returns a command array including the ansible-playbook command' do
    assert command_parts.include?('ansible-playbook')
  end

  test 'the last argument is the playbook_file' do
    assert command_parts.last == playbook_file
  end

  describe 'environment variables' do
    let(:environment_variables) { subject.command.first }

    test 'has a JSON_INVENTORY_FILE set' do
      assert environment_variables['JSON_INVENTORY_FILE']
    end

    test 'has no ANSIBLE_CALLBACK_WHITELIST set by default' do
      assert_not environment_variables['ANSIBLE_CALLBACK_WHITELIST']
    end

    test 'with a REX command it sets ANSIBLE_CALLBACK_WHITELIST to empty' do
      set_command_options(:remote_execution_command, true)
      assert environment_variables['ANSIBLE_CALLBACK_WHITELIST']
    end
  end

  describe 'command options' do
    it 'can have verbosity set' do
      level = '3'
      level_string = Array.new(level.to_i).map { 'v' }.join
      set_command_options(:verbosity_level, level)
      assert command_parts.any? do |part|
        part == "-#{level_string}"
      end
    end

    it 'can have a timeout set' do
      timeout = '5555'
      set_command_options(:timeout, timeout)
      assert command_parts.include?(timeout)
    end
  end

  private

  def command_parts
    subject.command.flatten.map(&:to_s)
  end

  def set_command_options(option, value)
    subject.instance_eval("@options[:#{option}] = \"#{value}\"",
                          __FILE__, __LINE__ - 1)
  end
end
