if defined? ForemanRemoteExecution
  module ForemanAnsible
    class AnsibleTemplateRenderer < InputTemplateRenderer
      alias_method :playbook, :render

      def initialize(job_template,
                     host = nil,
                     invocation = nil,
                     input_values = nil,
                     preview = false,
                     templates_stack = [])
        super(job_template, host, invocation, input_values, preview,
              templates_stack)
      end

      # Takes the variables from host and host group parameters and
      # sets them in the 'Host variables' and 'Group variables' format
      # in the inventory. For instance:
      #
      # host.example.com
      #
      # [hostgroup:vars]
      # parameter=value
      #
      # It does not nest group variables, but instead it creates a new group per
      # host group full title
      #
      def inventory
        inventory = ''
        inventory << host_variables
        inventory << group_variables
        inventory
      end

      private

      def host_variables
        host_parameters = build_parameters_hash(Host, target_hosts)

        variables = ''
        host_parameters.each do |host, parameters|
          variables += "#{host.name} "
          parameters.each do |parameter|
            variables += "#{parameter.name}=#{parameter.value}"
          end
          variables += "\n"
        end

        variables
      end

      def group_variables
        group_parameters = build_parameters_hash(Hostgroup, target_hostgroups)

        variables = ''
        group_parameters.each do |group, parameters|
          variables += "[#{group.title}]\n"
          target_hosts.each do |host|
            variables += "#{host.name}\n"
          end
          variables += "[#{group.title}:vars]\n"
          parameters.each do |parameter|
            variables += "#{parameter.first}=#{parameter.last}\n"
          end
          variables += "\n"
        end

        variables
      end

      def build_parameters_hash(model, collection)
        collection.inject({}) do |model_parameters, model|
          model_parameters.merge(model => model.parameters)
        end
      end

      def target_hosts
        @invocation.job_invocation.targeting.hosts
      end

      def target_hostgroups
        target_hosts.map(&:hostgroup).compact
      end
    end
  end
end
