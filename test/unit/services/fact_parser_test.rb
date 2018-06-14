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
      os = @facts_parser.operatingsystem
      assert_equal '10', os.major
      assert_equal 'Debian', os.name
    end
  end
end
