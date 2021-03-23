module ForemanAnsible
  module Concerns
    module AnsibleVariableOverrides
      extend ActiveSupport::Concern

      include Foreman::Controller::Parameters::Hostgroup
      include Foreman::Controller::Parameters::Host

      def to_response(resolver)
        resolver.ansible_variables.group_by(&:ansible_role).each_with_object([]) do |(role, variables), memo|
          var_hash = variables.map do |var|
            {
              :id => var.id,
              :parameter => var.key,
              :override => var.override?,
              :description => var.description,
              :parameter_type => var.parameter_type,
              :hidden_value? => var.hidden_value?,
              :omit => var.omit,
              :required => var.required,
              :validator_type => var.validator_type,
              :validator_rule => var.validator_rule,
              :default_value => var.default_value,
              :override_values => var.lookup_values.map { |lv| { :id => lv.id, :match => lv.match, :value => lv.value, :omit => lv.omit } },
              :current_override => resolver.resolve(var)
            }
          end

          memo.push(:id => role.id, :name => role.name, :ansible_variables => var_hash)
          memo
        end
      end

      def refresh_host
        @host = Host::Base.authorized(:view_hosts, Host).find_by(:id => params[:host_id] || params.dig(:host, :id))
        @host ||= Host.new(host_params)

        unless @host.is_a?(Host::Managed)
          @host      = @host.becomes(Host::Managed)
          @host.type = 'Host::Managed'
        end
        @host.attributes = host_params unless @host.new_record?

        @host.lookup_values.each(&:validate_value)
        @host
      end

      def hostgroup_params
        super 'hostgroup'
      end

      def host_params
        super 'host'
      end

      def process_hostgroup
        define_parent
        refresh_hostgroup
        inherit_parent_attributes
      end

      def define_parent
        return unless params[:hostgroup][:parent_id]
        @parent = Hostgroup.authorized(:view_hostgroups).find(params[:hostgroup][:parent_id])
      end

      def refresh_hostgroup
        if params[:hostgroup][:id].present?
          @hostgroup = Hostgroup.authorized(:view_hostgroups).find(params[:hostgroup][:id])
          @hostgroup.attributes = hostgroup_params
        else
          @hostgroup = Hostgroup.new(hostgroup_params)
        end

        @hostgroup.lookup_values.each(&:validate_value)
        @hostgroup
      end

      def inherit_parent_attributes
        return unless @parent

        @hostgroup.architecture       ||= @parent.architecture
        @hostgroup.operatingsystem    ||= @parent.operatingsystem
        @hostgroup.domain             ||= @parent.domain
        @hostgroup.subnet             ||= @parent.subnet
        @hostgroup.realm              ||= @parent.realm
        @hostgroup.environment        ||= @parent.environment
      end
    end
  end
end
