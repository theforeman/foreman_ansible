# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Roles
    class AnsibleRolesController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::ForemanAnsible::AnsibleRolesDataPreparations

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      before_action :find_resource, :only => [:show, :destroy]
      before_action :find_proxy, :only => [:import, :obsolete, :fetch, :sync]
      before_action :create_importer, :only => [:import, :obsolete, :fetch, :sync]

      api :GET, '/ansible_roles/:id', N_('Show role')
      param :id, :identifier, :required => true
      def show; end

      api :GET, '/ansible_roles', N_('List Ansible roles')
      param_group :search_and_pagination, ::Api::V2::BaseController
      add_scoped_search_description_for(AnsibleRole)
      def index
        @ansible_roles = resource_scope_for_index
      end

      api :DELETE, '/ansible_roles/:id', N_('Deletes Ansible role')
      param :id, :identifier, :required => true
      def destroy
        process_response @ansible_role.destroy
      end

      api :PUT, '/ansible_roles/import', N_('DEPRECATED: Import Ansible roles'), deprecated: true
      param :proxy_id, :identifier, :required => true, :desc => N_('Smart Proxy to import from')
      param :role_names, Array, N_('Ansible role names to be imported')
      def import
        Foreman::Deprecation.api_deprecation_warning(_('Use sync instead, to sync roles from Smart Proxy with Ansible feature enabled'))
        new_roles = @roles_importer.import_role_names['new']
        if role_names.present?
          new_roles.select! do |role|
            role_names.include?(role.name)
          end
        end
        new_roles.map(&:save)
        @imported = new_roles
      end

      api :PUT, '/ansible_roles/sync', N_('Sync Ansible roles')
      param :proxy_id, :identifier, :required => true, :desc => N_('Smart Proxy to sync from')
      param :role_names, Array, N_('Ansible role names to be synced')
      def sync
        params = @importer.import!(role_names)
        if params['changed'].present?
          @task = @importer.confirm_sync(params)
        else
          render_message _('No changes detected in specified Ansible Roles and their variables')
        end
      end

      api :PUT, '/ansible_roles/obsolete', N_('DEPRECATED: Obsolete Ansible roles'), deprecated: true
      param :proxy_id, :identifier, N_('Smart Proxy to import from')
      def obsolete
        Foreman::Deprecation.api_deprecation_warning(_('Use sync instead, to sync roles from Smart Proxy with Ansible feature enabled'))
        @obsoleted = @importer.obsolete!
      end

      api :GET, '/ansible_roles/fetch',
          N_('Fetch Ansible roles available to be synced')
      param :proxy_id, :identifier, N_('Smart Proxy to fetch from'),
            :required => true
      def fetch
        fetched =  prepare_ansible_import_rows(@roles_importer.import!, @variables_importer, false)
        respond_to do |format|
          format.json do
            render :json => { :results => { :ansible_roles => fetched } }
          end
        end
      end

      private

      def role_names
        params.fetch(:role_names, [])
      end

      # rubocop:disable Layout/DotPosition
      def find_proxy
        unless params[:proxy_id]
          msg = _('Smart proxy id is required')
          return render_error('custom_error', :status => :unprocessable_entity, :locals => { :message => msg })
        end
        @proxy = SmartProxy.authorized(:view_smart_proxies)
                           .find(params[:proxy_id])
      end
      # rubocop:enable Layout/DotPosition

      def create_importer
        @roles_importer = ForemanAnsible::UIRolesImporter.new(@proxy)
        @variables_importer = ForemanAnsible::VariablesImporter.new(@proxy)
        @importer = ForemanAnsible::ApiRolesImporter.new(@proxy)
      end
    end
  end
end
