# frozen_string_literal: true

module ForemanAnsible
  # Override methods from Foreman app/services/fact_importer so that Ansible
  # facts are recognized in Foreman as ForemanAnsible facts. It supports
  # nested facts.
  #
  # Only relevant for 1.12 and lower versions
  class FactImporter < ::FactImporter
    def fact_name_class
      ForemanAnsible::FactName
    end

    def initialize(host, facts = {})
      # Try to assign these facts to the correct host as per the facts say
      # If that host isn't created yet, the host parameter will contain it
      @host = Host.find_by(:name => facts[:ansible_facts][:ansible_fqdn] ||
                                    facts[:ansible_facts][:fqdn]) ||
              host
      @facts = normalize(facts[:ansible_facts])
      @original_facts = FactSparser.unsparse(facts[:ansible_facts])
      @counters = {}
    end

    private

    def add_new_facts
      @counters[:added] = 0
      add_missing_facts(FactSparser.unsparse(@original_facts))
      logger.debug(
        "Merging facts for '#{host}': added #{@counters[:added]} facts"
      )
    end

    def add_missing_facts(imported_facts, parent = nil, prefix = '')
      imported_facts.reject! { |_fact_name, fact_value| fact_value.nil? }

      imported_facts.each do |imported_name, imported_value|
        fact_fqn = fact_fqn(imported_name, prefix)
        fact_name = find_or_create_fact_name(fact_fqn, parent, imported_value)
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
      db_fact_names = if db_facts.is_a? Hash
                        db_facts.keys
                      else
                        db_facts
                      end
      # In Foreman versions prior to 1.14, the db_facts key
      # used to be a hash. Now it's an ActiveRecord::AssociationRelation
      @missing_facts ||= facts.keys +
                         FactSparser.sparse(@original_facts).keys -
                         db_fact_names
    end

    # Returns pairs [id, fact_name]
    def fact_names
      fact_name_class.group('name').maximum(:id)
    end

    # Fact fully qualified name contains an unambiguous name for a fact
    # e.g: ansible_lo::ipv6, ansible_virbr0::active
    def fact_fqn(name, prefix)
      prefix.empty? ? name : prefix + FactName::SEPARATOR + name
    end

    def find_or_create_fact_name(name, parent, fact_value)
      return fact_name_class.find(fact_names[name]) if fact_names[name].present?

      fact_name_class.create!(:name => name,
                              :parent => parent,
                              :compose => compose?(fact_value))
    end

    def add_fact_value(value, fact_name)
      return unless missing_facts.include?(fact_name.name)

      method = host.new_record? ? :build : :create!
      host.fact_values.send(method,
                            :value => value.to_s,
                            :fact_name => fact_name)
      @counters[:added] += 1
    end

    def compose?(fact_value)
      fact_value.is_a?(Hash) ||
        fact_value.is_a?(Array) && fact_value.first.is_a?(Hash)
    end
  end
end
