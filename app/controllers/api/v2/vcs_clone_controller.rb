module Api
  module V2
    class VcsCloneController < ::Api::V2::BaseController
      include ::ForemanAnsible::ProxyAPI
      include ::Api::Version2

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      def_param_group :repo_information do
        param :repo_info, Hash, :desc => N_('Hash containing info about the Ansible role to be installed') do
          param :vcs_url, String, :desc => N_('URL of the repository'), :required => true
          param :role_name, String, :desc => N_('Name of the Ansible role'), :required => true
          param :ref, String, :desc => N_('Branch / Tag / Commit reference'), :required => true
        end
      end

      rescue_from ActionController::ParameterMissing do |e|
        render json: { 'error' => e.message }, status: :bad_request
      end

      skip_before_action :verify_authenticity_token

      before_action :set_proxy_api

      api :GET, '/smart_proxies/:smart_proxy_id/ansible/vcs_clone/repository_metadata',
          N_('Retrieve metadata about the repository associated with a Smart Proxy.')
      param :smart_proxy_id, Array, N_('Name of the Smart Proxy'), :required => true
      param :vcs_url, String, N_('URL of the repository'), :required => true
      error 400, :desc => N_('Invalid or missing parameters')
      def repository_metadata
        vcs_url = params.require(:vcs_url)
        render json: @proxy_api.repo_information(vcs_url)
      end

      api :GET, '/smart_proxies/:smart_proxy_id/ansible/vcs_clone/roles',
          N_('Returns an array of Ansible roles installed on the provided Smart Proxy')
      formats ['json']
      param :smart_proxy_id, Array, N_('Name of the SmartProxy'), :required => true
      error 400, :desc => N_('Invalid or missing parameters')
      def installed_roles
        render json: @proxy_api.list_installed
      end

      api :POST, '/smart_proxies/:smart_proxy_id/ansible/vcs_clone/roles',
          N_('Launches a task to install the provided role')
      formats ['json']
      param_group :repo_information
      param :smart_proxy_id, Array, N_('Smart Proxy where the role should be installed')
      error 400, :desc => N_('Invalid or missing parameters')
      def install_role
        payload = verify_install_role_parameters(params)
        start_vcs_task(payload, :install)
      end

      api :PUT, '/smart_proxies/:smart_proxy_id/ansible/vcs_clone/roles',
          N_('Launches a task to update the provided role')
      formats ['json']
      param_group :repo_information
      param :smart_proxy_id, Array, N_('Smart Proxy where the role should be installed')
      error 400, :desc => N_('Invalid or missing parameters')
      def update_role
        payload = verify_update_role_parameters(params)
        payload['name'] = params.require(:role_name)
        start_vcs_task(payload, :update)
      end

      api :DELETE, '/smart_proxies/:smart_proxy_id/ansible/vcs_clone/roles/:role_name',
          N_('Launches a task to delete the provided role')
      formats ['json']
      param :role_name, String, :desc => N_('Name of the role to be deleted')
      param :smart_proxy_id, Array, N_('Smart Proxy to delete the role from')
      error 400, :desc => N_('Invalid or missing parameters')
      def delete_role
        payload = params.require(:role_name)
        start_vcs_task(payload, :delete)
      end

      private

      def set_proxy_api
        unless params[:id]
          msg = _('Smart proxy id is required')
          return render_error('custom_error', :status => :unprocessable_entity, :locals => { :message => msg })
        end
        ansible_proxy = SmartProxy.find_by(id: params[:id])
        if ansible_proxy.nil?
          msg = _('Smart proxy does not exist')
          return render_error('custom_error', :status => :bad_request, :locals => { :message => msg })
        else unless ansible_proxy.has_capability?('Ansible', 'vcs_clone')
               msg = _('Smart Proxy is missing foreman_ansible installation or Git cloning capability')
               return render_error('custom_error', :status => :bad_request, :locals => { :message => msg })
             end
        end
        @proxy = ansible_proxy
        @proxy_api = find_proxy_api(ansible_proxy)
      end

      def permit_parameters(params)
        params.require(:vcs_clone).
          permit(
            repo_info: [
              :vcs_url,
              :role_name,
              :ref
            ]
          ).to_h
      end

      def verify_install_role_parameters(params)
        payload = permit_parameters params
        %w[vcs_url role_name ref].each do |param|
          raise ActionController::ParameterMissing.new(param) unless payload['repo_info'].key?(param)
        end
        payload
      end

      def verify_update_role_parameters(params)
        payload = permit_parameters params
        %w[vcs_url ref].each do |param|
          raise ActionController::ParameterMissing.new(param) unless payload['repo_info'].key?(param)
        end
        payload
      end

      def start_vcs_task(op_info, operation)
        case operation
        when :update
          job = UpdateAnsibleRole.perform_later(op_info, @proxy)
        when :install
          job = CloneAnsibleRole.perform_later(op_info, @proxy)
        when :delete
          job = DeleteAnsibleRole.perform_later(op_info, @proxy)
        else
          raise Foreman::Exception.new(N_('Unsupported operation'))
        end

        task = ForemanTasks::Task.find_by(external_id: job.provider_job_id)

        render json: {
          task: task
        }, status: :ok
      rescue Foreman::Exception
        head :internal_server_error
      end
    end
  end
end
