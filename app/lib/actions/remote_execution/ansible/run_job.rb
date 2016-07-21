if defined? ForemanRemoteExecution
  module Actions
    module RemoteExecution
      module Ansible
        # Define Ansible remote execution job
        class RunJob < RunHostJob
          def plan(job_invocation, host, template_invocation, proxy)
            super(job_invocation, host, template_invocation, proxy)
            ansible_template = ansible_template(template_invocation, host)
            provider = template_invocation.template.provider

            plan_action(
              Ansible::RunProxyCommand,
              proxy,
              ansible_template.inventory,
              ansible_template.playbook,
              provider.proxy_command_options(template_invocation, host))
          end

          def ansible_template(template_invocation, host)
            ForemanAnsible::AnsibleTemplateRenderer.new(
              template_invocation.template,
              host,
              template_invocation)
          end
        end
      end
    end
  end
end
