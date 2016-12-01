module ForemanAnsible
  # Override methods from Foreman app/services/fact_parser so that facts
  # representing host properties are understood when they come from Ansible.
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
      name = detect_fact([:ansible_product_name, :facter_virtual,
                          :facter_productname, :facter_model, :model])
      Model.where(:name => name.strip).first_or_create unless name.blank?
    end

    def domain
      name = detect_fact([:ansible_domain, :facter_domain, :ohai_domain, :domain])
      Domain.where(:name => name).first_or_create unless name.blank?
    end

    def support_interfaces_parsing?
      true
    end

    # Move ansible's default interface first in the list of interfaces since
    # Foreman picks the first one that is usable. If ansible has no
    # preference otherwise at least sort the list.
    #
    # This method overrides app/services/fact_parser.rb on Foreman and returns
    # an array of interface names, ['eth0', 'wlan1', etc...]
    def get_interfaces # rubocop:disable Style/AccessorMethodName
      pref = facts[:ansible_default_ipv4] &&
             facts[:ansible_default_ipv4]['interface']
      if pref.present?
        (facts[:ansible_interfaces] - [pref]).unshift(pref)
      else
        (facts[:ansible_interfaces].sort unless facts[:ansible_interfaces].nil?) || []
      end
    end

    def get_facts_for_interface(interface)
      interface.tr!('-', '_') # virbr1-nic -> virbr1_nic
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
        facts[:ansible_lsb] && facts[:ansible_lsb]['major_release'] || 
        (facts[:version].split('R')[0] if os_name == 'junos')
    end

    def os_release
      facts[:ansible_distribution_version] ||
        facts[:ansible_lsb] && facts[:ansible_lsb]['release']
    end

    def os_minor
      _, minor = (os_release.split('.') unless os_release.nil?) ||
                 (facts[:version].split('R') if os_name == 'junos')
      minor || ''
    end

    def os_description
      facts[:ansible_lsb] && facts[:ansible_lsb]['description']
    end

    # Returns first non-empty fact. Needed to check for empty strings.
    def detect_fact(fact_names)
      facts[
        fact_names.detect do |fact_name|
          facts[fact_name].present?
        end
      ]
    end
  end
end
