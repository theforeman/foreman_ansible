require 'test_plugin_helper'

module ForemanAnsible
  # Test for the facts importer - only verify that given
  # a set of facts it's able to import them
  class FactImporterTest < ActiveSupport::TestCase
    setup do
      @host = FactoryGirl.build(:host)
    end

    test 'add new facts adds all fact names in the fixture' do
      @fact_importer = FactImporter.new(@host, facts_json)
      facts_to_be_added = FactSparser.sparse(facts_json[:ansible_facts]).keys +
                          FactSparser.unsparse(facts_json[:ansible_facts]).keys
      @fact_importer.send(:add_new_facts)
      assert((facts_to_be_added - FactName.all.map(&:name)).empty?)
    end

    test 'missing_facts returns facts we do not have in the database' do
      @fact_importer = FactImporter.new(@host, facts_json)
      @fact_importer.expects(:db_facts).
        returns('ansible_cmdline' => 'fakevalue')
      refute @fact_importer.send(:missing_facts).include?('ansible_cmdline')
    end

    describe '#add_fact_value' do
      setup do
        @fact_importer = FactImporter.new(@host, :ansible_facts => {})
      end
      test 'does not add existing facts' do
        existing_fact = FactoryGirl.build(:fact_name)
        @fact_importer.expects(:missing_facts).returns([])
        assert_nil @fact_importer.send(:add_fact_value, nil, existing_fact)
      end

      test 'adds missing facts' do
        missing_fact = FactoryGirl.build(:fact_name)
        @fact_importer.expects(:missing_facts).returns([missing_fact.name])
        @fact_importer.counters[:added] = 0
        assert_difference('@host.fact_values.count', 1) do
          @fact_importer.send(:add_fact_value, 'missing_value', missing_fact)
          @host.save
          # We have to save the host in order to ensure @host.fact_values.count
          # resolves properly (otherwise) :add_fact_value just won't save the
          # relation
        end
      end
    end
  end
end
