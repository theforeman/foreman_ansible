module ForemanAnsible
  # On 1.13+ , use the parser for structured facts (like Facter 2) that comes
  # from core
  class StructuredFactImporter < ::StructuredFactImporter
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
