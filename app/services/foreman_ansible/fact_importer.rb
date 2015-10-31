module ForemanAnsible
  class FactImporter < ::FactImporter
    def fact_name_class
      ForemanAnsible::FactName
    end

    def initialize(host, facts = {})
      @host = host
      @facts = normalize(facts[:ansible_facts])
      @counters = {}
    end
  end
end
