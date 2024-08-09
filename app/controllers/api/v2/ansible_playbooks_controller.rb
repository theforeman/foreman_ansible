# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Roles
    class AnsiblePlaybooksController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::ForemanAnsible::ProxyAPI

      before_action :find_proxy, only: [:fetch, :sync]

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      api :PUT, '/ansible_playbooks/sync', N_('Sync Ansible playbooks')
      param :proxy_id, :identifier, :required => true, :desc => N_('Smart Proxy to sync from')
      param :playbooks_names, Array, N_('Ansible  playbooks names to be synced')
      def sync
        @task = plan_ansible_sync(@proxy.id, playbooks_names)
      end

      api :GET, '/ansible_playbooks/fetch', N_('Fetch Ansible playbooks available to be synced')
      param :proxy_id, :identifier, N_('Smart Proxy to fetch from'),
            :required => true
      def fetch
        fetched = fetch_playbooks_names
        render :json => { :results => { :playbooks_names => fetched } }
      end

      def action_permission
        case params[:action]
        when 'sync', 'fetch'
          :import
        else
          super
        end
      end

      def plan_ansible_sync(proxy_id, playbooks_names)
        ForemanTasks.async_task(Actions::SyncPlaybooks, proxy_id, playbooks_names)
      end

      private

      def find_proxy
        unless params[:proxy_id]
          msg = _('Smart proxy id is required')
          render_error('custom_error', :status => :unprocessable_entity, :locals => { :message => msg })
          return false
        end
        @proxy = SmartProxy.find(params[:proxy_id])
      end

      def fetch_playbooks_names
        proxy_api = find_proxy_api(@proxy)
        proxy_api.playbooks_names if @proxy
      end

      def playbooks_names
        params.fetch(:playbooks_names, [])
      end
    end
  end
end
