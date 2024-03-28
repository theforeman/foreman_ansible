# frozen_string_literal: true

module Api
  module V2
    class VcsCloneController < ::Api::V2::BaseController
      include ::ForemanAnsible::ProxyAPI

      rescue_from ActionController::ParameterMissing do |e|
        render json: { 'error' => e.message }, status: :bad_request
      end

      skip_before_action :verify_authenticity_token

      before_action :set_proxy_api

      api :GET, '/smart_proxies/:proxy_name/ansible/vcs_clone/repo_information',
          N_('Queries metadata about the repo')
      param :proxy_name, Array, N_('Name of the SmartProxy'), :required => true
      param :vcs_url, String, N_('Url of the repo'), :required => true
      error 400, :desc => N_('Parameter unfulfilled / invalid repo-info')
      def repo_information
        vcs_url = params.require(:vcs_url)
        render json: @proxy_api.repo_information(vcs_url)
      end

      api :GET, '/smart_proxies/:proxy_name/ansible/vcs_clone/roles',
          N_('Returns an array of roles installed on the provided proxy')
      formats ['json']
      param :proxy_name, Array, N_('Name of the SmartProxy'), :required => true
      error 400, :desc => N_('Parameter unfulfilled')
      def installed_roles
        render json: @proxy_api.list_installed
      end

      api :POST, '/smart_proxies/:proxy_name/ansible/vcs_clone/roles',
          N_('Launches a task to install the provided role')
      formats ['json']
      param :repo_info, Hash, :desc => N_('Dictionary containing info about the role to be installed') do
        param :vcs_url, String, :desc => N_('Url of the repo'), :required => true
        param :name, String, :desc => N_('Name of the repo'), :required => true
        param :ref, String, :desc => N_('Branch / Tag / Commit reference'), :required => true
      end
      param :smart_proxy, Array, N_('SmartProxy the role should get installed to')
      error 400, :desc => N_('Parameter unfulfilled')
      def install_role
        payload = verify_install_role_parameters(params)
        start_vcs_task(payload, :install)
      end

      api :PUT, '/smart_proxies/:proxy_name/ansible/vcs_clone/roles',
          N_('Launches a task to update the provided role')
      formats ['json']
      param :repo_info, Hash, :desc => N_('Dictionary containing info about the role to be installed') do
        param :vcs_url, String, :desc => N_('Url of the repo'), :required => true
        param :name, String, :desc => N_('Name of the repo'), :required => true
        param :ref, String, :desc => N_('Branch / Tag / Commit reference'), :required => true
      end
      param :smart_proxy, Array, N_('SmartProxy the role should get installed to')
      error 400, :desc => N_('Parameter unfulfilled')
      def update_role
        payload = verify_update_role_parameters(params)
        payload['name'] = params.require(:role_name)
        start_vcs_task(payload, :update)
      end

      api :DELETE, '/smart_proxies/:proxy_name/ansible/vcs_clone/roles/:role_name',
          N_('Launches a task to delete the provided role')
      formats ['json']
      param :role_name, String, :desc => N_('Name of the role that should be deleted')
      param :smart_proxy, Array, N_('SmartProxy the role should get deleted from')
      error 400, :desc => N_('Parameter unfulfilled')
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
               msg = _('Smart proxy does not have foreman_ansible installed / is not capable of cloning from VCS')
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
              :name,
              :ref
            ]
          ).to_h
      end

      def verify_install_role_parameters(params)
        payload = permit_parameters params
        %w[vcs_url name ref].each do |param|
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
