# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Roles
    class AnsibleRolesController < ::Api::V2::BaseController
      include ::Api::Version2

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      before_action :find_resource, :only => [:show, :destroy]
      before_action :find_proxy, :only => [:import, :obsolete, :fetch]
      before_action :create_importer, :only => [:import, :obsolete, :fetch]

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

      api :PUT, '/ansible_roles/import', N_('Import Ansible roles')
      param :proxy_id, :identifier, N_('Smart Proxy to import from')
      param :role_names, Array, N_('Ansible role names to import')
      def import
        @imported = @importer.import!(role_names)
      end

      api :PUT, '/ansible_roles/obsolete', N_('Obsolete Ansible roles')
      param :proxy_id, :identifier, N_('Smart Proxy to import from')
      def obsolete
        @obsoleted = @importer.obsolete!
      end

      api :GET, '/ansible_roles/fetch',
          N_('Fetch Ansible roles available to be imported')
      param :proxy_id, :identifier, N_('Smart Proxy to fetch from'),
            :required => true
      def fetch
        fetched = []
        @importer.fetch!.each do |role_name|
          fetched << { :name => role_name }
        end
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

      # rubocop:disable DotPosition
      def find_proxy
        return nil unless params[:proxy_id]
        @proxy = SmartProxy.authorized(:view_smart_proxies)
                           .find(params[:proxy_id])
      end
      # rubocop:enable DotPosition

      def create_importer
        @importer = ForemanAnsible::ApiRolesImporter.new(@proxy)
      end
    end
  end
end
