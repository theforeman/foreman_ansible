require 'test_plugin_helper'

module ForemanAnsible
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

    private

    def expect_where(model, fact_name)
      sample_mock = mock
      model.expects(:where).
        with(:name => fact_name).
        returns(sample_mock)
      sample_mock.expects(:first_or_create)
    end
  end
end
