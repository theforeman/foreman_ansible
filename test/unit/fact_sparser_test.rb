require 'test_plugin_helper'

module ForemanAnsible
  class FactSparserTest < ActiveSupport::TestCase
    setup do
      @original_os_facts = { 'operatingsystem' => { 'major' => 20, 'minor' => 1,
                                                    'name' => 'Fedora' } }
      @sparsed_os_facts = { 'operatingsystem::major' => 20,
                            'operatingsystem::minor' => 1,
                            'operatingsystem::name' => 'Fedora'}
    end

    test 'sparses simple hash' do
      assert_equal @sparsed_os_facts,
        ForemanAnsible::FactSparser.sparse(@original_os_facts)
    end

    test 'unsparse simple hash' do
      assert_equal @original_os_facts,
        ForemanAnsible::FactSparser.unsparse(@sparsed_os_facts)
    end
  end
end
