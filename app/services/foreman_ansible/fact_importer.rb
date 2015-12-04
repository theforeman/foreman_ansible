module ForemanAnsible
  class FactImporter < ::FactImporter
    def fact_name_class
      ForemanAnsible::FactName
    end

    def initialize(host, facts = {})
      @host = host
      @facts = normalize(facts[:ansible_facts])
      @original_facts = Sparser.unsparse(facts[:ansible_facts])
      @counters = {}
    end

    private

    def add_new_facts
      @counters[:added] = 0
      add_missing_facts(Sparser.unsparse(@original_facts))
      logger.debug("Merging facts for '#{host}': added #{@counters[:added]} facts")
    end

    def add_missing_facts(imported_facts, parent = nil, prefix = '')
      imported_facts.select! { |fact_name, fact_value| !fact_value.nil? }

      imported_facts.each do |imported_name, imported_value|
        fact_fqn = fact_fqn(imported_name, prefix)
        next unless missing_facts.include?(fact_fqn)
        fact_name = find_fact_name(fact_fqn, parent)

        add_fact_value(imported_value, fact_name)
        add_compose_fact(imported_value, fact_name, fact_fqn)
      end
    end

    def add_compose_fact(imported_values, fact_name, fact_fqn)
      if imported_values.is_a?(Hash)
        add_missing_facts(imported_values, fact_name, fact_fqn)
      elsif imported_values.is_a?(Array)
        imported_values.each do |imported_value|
          next unless imported_value.is_a?(Hash)
          add_missing_facts(imported_value, fact_name, fact_fqn)
        end
      end
    end

    def missing_facts
      @missing_facts ||= (facts.keys + Sparser.sparse(@original_facts).keys) - db_facts.keys
    end

    # Returns pairs [id, fact_name]
    def fact_names
      @fact_names ||= fact_name_class.maximum(:id, :group => 'name')
    end

    # Fact fully qualified name contains an unambiguous name for a fact
    # e.g: ansible_lo::ipv6, ansible_virbr0::active
    def fact_fqn(name, prefix)
      prefix.empty? ? name : prefix + FactName::SEPARATOR + name
    end

    def find_fact_name(name, parent)
      return FactName.find(fact_names[name]) if fact_names[name].present?
      fact_name_class.create!(:name => name,
                              :parent => parent,
                              :compose => compose)
    end

    def add_fact_value(value, fact_name)
      method = host.new_record? ? :build : :create!
      host.fact_values.send(method, :value => value, :fact_name => fact_name)
      @counters[:added] += 1
    end

    class Sparser
      class << self
        def sparse(hash, options = {} )
          hash.map do |k, v|
            prefix = options.fetch(:prefix, []) + [k]
            next sparse(v, options.merge(:prefix => prefix)) if v.is_a? Hash
            { prefix.join(options.fetch(:separator, FactName::SEPARATOR)) => v }
          end.reduce(:merge) || Hash.new
        end

        def unsparse(hash, options={})
          ret = Hash.new
          sparse(hash).each do |k, v|
            current = ret
            key = k.to_s.split(options.fetch(:separator, FactName::SEPARATOR))
            current = (current[key.shift] ||= Hash.new) until key.size <= 1
            current[key.first] = v
          end
          ret
        end
      end
    end
  end
end
