# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Roles
    class AnsiblePlaybooksController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::ForemanAnsible::ProxyAPI

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      api :PUT, '/ansible_playbooks/sync', N_('Sync Ansible playbooks')
      param :proxy_id, :identifier, :required => true, :desc => N_('Smart Proxy to sync from')
      param :playbooks_names, Array, N_('Ansible  playbooks names to be synced')
      def sync
        # importer.import_playbooks(playbooks_names)
        @task = plan_ansible_sync(proxy.id, playbooks_names)
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
        when 'sync'
          :sync
        when 'fetch'
          :fetch
        else
          super
        end
      end

      def plan_ansible_sync(proxy, playbooks_names)
        ForemanTasks.async_task(ImportPlaybooksJob::Async::SyncPlaybooks, proxy, playbooks_names)
      end

      private

      # rubocop:disable Layout/DotPosition
      def find_proxy
        unless params[:proxy_id]
          msg = _('Smart proxy id is required')
          return render_error('custom_error', :status => :unprocessable_entity, :locals => { :message => msg })
        end
        SmartProxy.authorized(:view_smart_proxies)
                  .find(params[:proxy_id])
      end
      # rubocop:enable Layout/DotPosition

      def fetch_playbooks_names
        proxy_api = find_proxy_api(proxy)
        proxy_api.playbooks_names if @proxy
      end

      def playbooks_names
        params.fetch(:playbooks_names, [])
      end

      def proxy
        @proxy ||= find_proxy
      end

      def importer
        @importer ||= ForemanAnsible::PlaybooksImporter.new(proxy)
      end
    end
  end
end
