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
        if AnsibleReportScanner.ansible_report?(raw) &&
           IPAddress.valid?(hostname) &&
           Nic::Interface.find_by(:ip => hostname)
          @host = Nic::Interface.find_by(:ip => hostname).host
        end
        super
        partial_hostname_match(hostname)
      end

      def self.authorized_smart_proxy_features
        super + ['Ansible']
      end

      def partial_hostname_match(hostname)
        return @host unless @host.new_record?
        hosts = Host.where(Host.arel_table[:name].matches("#{hostname}.%"))
        if hosts.count > 1
          msg = "More than 1 host found for name #{hostname}, "
          msg += 'please use host FQDN when uploading reports'
          Rails.logger.warn msg
          return @host
        end
        @host = hosts.first || @host
      end
    end
  end
end
