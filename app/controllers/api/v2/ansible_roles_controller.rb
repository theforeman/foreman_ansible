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
      before_action :find_proxy, :only => [:import, :obsolete]
      before_action :create_importer, :only => [:import, :obsolete]

      api :GET, '/ansible_roles/:id', N_('Show role')
      param :id, :identifier, :required => true
      def show; end

      api :GET, '/ansible_roles', N_('List Ansible roles')
      param_group :search_and_pagination, ::Api::V2::BaseController
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
      def import
        @imported = @importer.import!
      end

      api :PUT, '/ansible_roles/obsolete', N_('Obsolete Ansible roles')
      param :proxy_id, :identifier, N_('Smart Proxy to import from')
      def obsolete
        @obsoleted = @importer.obsolete!
      end

      private

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
