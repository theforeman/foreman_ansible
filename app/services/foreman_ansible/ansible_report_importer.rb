# frozen_string_literal: true

require 'ipaddress'
module ForemanAnsible
  # Ensures Ansible reports from hosts where the IP was used, are assigned
  # to the right hostname in Foreman
  module AnsibleReportImporter
    extend ActiveSupport::Concern
    included do
      def host
        hostname = name.downcase
        if AnsibleReportScanner.ansible_report?(raw['logs']) &&
           IPAddress.valid?(hostname) &&
           Nic::Interface.find_by(:ip => hostname)
          @host = Nic::Interface.find_by(:ip => hostname).host
        end
        super
      end
    end
  end
end
