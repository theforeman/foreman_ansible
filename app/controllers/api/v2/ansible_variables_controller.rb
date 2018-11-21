# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Variables
    class AnsibleVariablesController < ::Api::V2::BaseController
      include ::Api::Version2

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      before_action :find_resource, :only => [:show, :destroy]
      before_action :find_proxy, :only => [:import, :obsolete]
      before_action :create_importer, :only => [:import, :obsolete]

      api :GET, '/ansible_variables/:id', N_('Show variable')
      param :id, :identifier, :required => true
      def show; end

      api :GET, '/ansible_variables', N_('List Ansible variables')
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @ansible_variables = resource_scope_for_index
      end

      api :DELETE, '/ansible_variables/:id', N_('Deletes Ansible variable')
      param :id, :identifier, :required => true
      def destroy
        process_response @ansible_variable.destroy
      end

      api :PUT, '/ansible_variables/import',
          N_('Import Ansible variables. This will only import variables '\
             'for already existing roles, it will not import any new roles')
      param :proxy_id, :identifier, N_('Smart Proxy to import from')
      def import
        new_variables = @importer.import_variable_names([])[:new]
        new_variables.map(&:save)
        @imported = new_variables
      end

      api :PUT, '/ansible_variables/obsolete',
          N_('Obsolete Ansible variables. This will only obsolete variables '\
             'for already existing roles, it will not delete any old roles')
      param :proxy_id, :identifier, N_('Smart Proxy to import from')
      def obsolete
        old_variables = @importer.import_variable_names([])[:obsolete]
        old_variables.map(&:destroy)
        @obsoleted = old_variables
      end

      private

      def find_proxy
        return nil unless params[:proxy_id]

        @proxy = SmartProxy.
                 authorized(:view_smart_proxies).
                 find(params[:proxy_id])
      end

      def create_importer
        @importer = ForemanAnsible::VariablesImporter.new(@proxy)
      end
    end
  end
end
