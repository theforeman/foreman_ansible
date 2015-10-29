module ForemanAnsible
  class FactParser < ::FactParser
    attr_reader :facts

    def operatingsystem
      facts[:ansible_lsb]
    end

    def environment
      # Don't do anything
    end

    def architecture
      name = facts[:ansible_architecture] || facts[:facter_architecture]
      Architecture.where(:name => name).first_or_create unless name.blank?
    end

    def interfaces
      facts[:ansible_interfaces]
    end

    def model
      name = facts[:facter_virtual] if facts[:facter_is_virtual] == "true"
      name ||= facts[:ansible_product_name] ||
        facts[:facter_productname] ||
        facts[:facter_model]
      Model.where(:name => name.strip).first_or_create unless name.blank?
    end

    def domain
      name = facts[:ansible_domain] ||
        facts[:facter_domain] ||
        facts[:ohai_domain]
      Domain.where(:name => name).first_or_create unless name.blank?
    end

    def support_interfaces_parsing?
      true
    end
  end
end
