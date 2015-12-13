require 'test_plugin_helper'

module ForemanAnsible
  class FactParserTest < ActiveSupport::TestCase
    setup do
      facts_json = HashWithIndifferentAccess.new(JSON.parse(sample_facts_file))
      @facts_importer = ForemanAnsible::FactParser.new(facts_json)
    end

    test 'finds facter domain even if ansible_domain is empty' do
      expect_where(Domain, @facts_importer.facts[:facter_domain])
      @facts_importer.domain
    end

    test 'finds model' do
      expect_where(Model, @facts_importer.facts[:ansible_product_name])
      @facts_importer.model
    end

    test 'finds architecture' do
      expect_where(Architecture, @facts_importer.facts[:ansible_architecture])
      @facts_importer.architecture
    end

    test 'does not set environment' do
      refute @facts_importer.environment
    end

    test 'creates operatingsystem from operating system options' do
      sample_mock = mock
      major_fact = @facts_importer.facts['ansible_distribution_major_version']
      _, minor_fact = @facts_importer.
                      facts['ansible_distribution_version'].split('.')
      Operatingsystem.expects(:where).
        with(:name => @facts_importer.facts['ansible_distribution'],
             :major => major_fact, :minor => minor_fact || '').
        returns(sample_mock)
      sample_mock.expects(:first)
      @facts_importer.operatingsystem
    end

    private

    def expect_where(model, fact_name)
      sample_mock = mock
      model.expects(:where).
        with(:name => fact_name).
        returns(sample_mock)
      sample_mock.expects(:first_or_create)
    end

    def sample_facts_file
      File.read(File.join(Engine.root, 'test', 'fixtures', 'sample_facts.json'))
    end
  end
end
