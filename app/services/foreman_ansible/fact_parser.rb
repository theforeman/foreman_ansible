module ForemanAnsible
  class FactParser < ::FactParser
    attr_reader :facts

    def initialize(facts)
      @facts = HashWithIndifferentAccess.new(facts[:ansible_facts])
    end

    def operatingsystem
      args = { :name => os_name, :major => os_major, :minor => os_minor }
      Operatingsystem.where(args).first ||
        Operatingsystem.create!(args.merge(:description => os_description))
    end

    def environment; end # Don't do anything as there's no env in Ansible

    def architecture
      name = facts[:ansible_architecture] || facts[:facter_architecture]
      Architecture.where(:name => name).first_or_create unless name.blank?
    end

    def model
      name ||= facts[:ansible_product_name] ||
               facts[:facter_virtual] ||
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

    def get_interfaces
      # Move ansibles default interface first in the list of interfaces since
      # Foreman picks the first one that is usable. If ansible has no
      # preference otherwise at least sort the list.
      pref = facts[:ansible_default_ipv4] &&
                facts[:ansible_default_ipv4]['interface']
      pref ? (facts[:ansible_interfaces] - [pref]).unshift(pref) :
                facts[:ansible_interfaces].sort
    end

    def get_facts_for_interface(interface)
      interface.gsub!(/-/, '_') # virbr1-nic -> virbr1_nic
      interface_facts = facts[:"ansible_#{interface}"]
      ipaddress = ip_from_interface(interface)
      HashWithIndifferentAccess[interface_facts.merge(:ipaddress => ipaddress)]
    end

    def ipmi_interface; end

    private

    def ip_from_interface(interface)
      return unless facts[:"ansible_#{interface}"]['ipv4'].present?
      facts[:"ansible_#{interface}"]['ipv4']['address']
    end

    def os_name
      facts[:ansible_distribution] ||
        facts[:ansible_lsb] && facts[:ansible_lsb]['id']
    end

    def os_major
      facts[:ansible_distribution_major_version] ||
        facts[:ansible_lsb] && facts[:ansible_lsb]['major_release']
    end

    def os_release
      facts[:ansible_distribution_version] ||
        facts[:ansible_lsb] && facts[:ansible_lsb]['release']
    end

    def os_minor
      _, minor = os_release.split('.')
      minor || ''
    end

    def os_description
      facts[:ansible_lsb] && facts[:ansible_lsb]['description']
    end
  end
end
