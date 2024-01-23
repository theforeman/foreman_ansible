# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Variables
    class AnsibleVariablesController < ::Api::V2::BaseController
      include ::Api::Version2
      include Foreman::Controller::Parameters::AnsibleVariable

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      skip_before_action :verify_authenticity_token
      before_action :find_resource, :only => [:show, :destroy, :update]
      before_action :find_proxy, :only => [:import, :obsolete]
      before_action :create_importer, :only => [:import, :obsolete, :from_json, :from_yaml, :yaml_to_json]

      api :GET, '/ansible_variables/:id', N_('Show variable')
      param :id, :identifier, :required => true
      def show; end

      api :GET, '/ansible_variables', N_('List Ansible variables')
      param_group :search_and_pagination, ::Api::V2::BaseController
      add_scoped_search_description_for(AnsibleVariable)
      def index
        @ansible_variables = resource_scope_for_index
      end

      api :DELETE, '/ansible_variables/:id', N_('Deletes Ansible variable')
      param :id, :identifier, :required => true
      def destroy
        @ansible_variable.destroy
        render 'api/v2/ansible_variables/destroy'
      end

      def_param_group :ansible_variable do
        param :ansible_variable, Hash, :required => true, :action_aware => true do
          param :variable, String, :required => true, :desc => N_("Name of variable")
          param :ansible_role_id, :number, :required => true, :desc => N_("Role ID")
          param :default_value, :any_type, :of => LookupKey::KEY_TYPES, :desc => N_("Default value of variable")
          param :hidden_value, :bool, :desc => N_("When enabled the parameter is hidden in the UI")
          param :override_value_order, String, :desc => N_("The order in which values are resolved")
          param :description, String, :desc => N_("Description of variable")
          param :validator_type, LookupKey::VALIDATOR_TYPES, :desc => N_("Types of validation values")
          param :validator_rule, String, :desc => N_("Used to enforce certain values for the parameter values")
          param :variable_type, LookupKey::KEY_TYPES, :desc => N_("Types of variable values")
          param :merge_overrides, :bool, :desc => N_("Merge all matching values (only array/hash type)")
          param :merge_default, :bool, :desc => N_("Include default value when merging all matching values")
          param :avoid_duplicates, :bool, :desc => N_("Remove duplicate values (only array type)")
          param :override, :bool, :desc => N_("Whether to override variable or not")
        end
      end

      api :POST, '/ansible_variables', N_('Create Ansible variable')
      param_group :ansible_variable, :as => :create
      def create
        @ansible_variable = AnsibleVariable.new(ansible_variable_params.merge(:imported => false))
        process_response @ansible_variable.save
      end

      api :PUT, '/ansible_variables/:id', N_('Updates Ansible variable')
      param :id, :identifier, :required => true
      param_group :ansible_variable, :as => :update

      def update
        @ansible_variable.update!(ansible_variable_params)
        render 'api/v2/ansible_variables/show'
      end

      api :PUT, '/ansible_variables/import',
          N_('DEPRECATED: Import Ansible variables. This will only import variables '\
             'for already existing roles, it will not import any new roles'), deprecated: true
      param :proxy_id, :identifier, N_('Smart Proxy to import from'), :required => true
      def import
        Foreman::Deprecation.api_deprecation_warning(_('Use sync instead, to sync roles from Smart Proxy with Ansible feature enabled'))
        new_variables = @importer.import_variable_names([])[:new]
        new_variables.map(&:save)
        @imported = new_variables
      end

      api :PUT, '/ansible_variables/obsolete',
          N_('DEPRECATED: Obsolete Ansible variables. This will only obsolete variables '\
             'for already existing roles, it will not delete any old roles'), deprecated: true
      param :proxy_id, :identifier, N_('Smart Proxy to import from'), :required => true
      def obsolete
        Foreman::Deprecation.api_deprecation_warning(_('Use sync instead, to sync roles from Smart Proxy with Ansible feature enabled'))
        old_variables = @importer.import_variable_names([])[:obsolete]
        old_variables.map(&:destroy)
        @obsoleted = old_variables
      end

      api :POST, '/ansible_variables/import/yaml_to_json',
          N_('Converts the YAML-file into a JSON-representation the UI can work with')
      param :data, Integer, N_('YAML-file as a base64-encoded string')
      def yaml_to_json
        enc_file = params.require(:data)
        render json: encoded_yaml_to_hash(enc_file)
      end

      api :PUT, '/ansible_variables/import/from_yaml', N_('Import Ansible variables directly from YAML files')
      param :data, Hash, N_('Dictionary of role names and base64-encoded YAML files')
      # param structure:
      # {
      #   "data": {
      #     <role_name>: {
      #       "data": <base64-enc YAML-file>
      #     },
      #     <role_name>: {
      #       "data": <base64-enc YAML-file>
      #     }
      #     ...
      #   }
      # }
      # How to document this using apipie?
      def from_yaml
        level_zero_data = params.require(:data)
        temp_hash = {}
        level_zero_data.each do |role_name, data|
          enc_file = data.require(:data)
          yaml_hash = encoded_yaml_to_hash(enc_file)
          temp_hash[role_name] = {} unless temp_hash[role_name]
          temp_hash[role_name] = yaml_hash.merge(temp_hash[role_name])
        end
        from_hash(temp_hash)
      end

      api :PUT, '/ansible_variables/import/from_json', N_('Import Ansible variables from JSON. Allows finer control over names, types and default values.')
      param :data, Hash, N_('Dictionary of role names and dictionaries of variable names and a hash containing variable value and type.')
      # param structure:
      # {
      #   "data": {
      #     <role_name>: {
      #       <var_name>: {
      #         "value": <var_value>,
      #         "type": <var_type>
      #       },
      #       ...
      #     },
      #     <role_name>: {
      #       <var_name>: {
      #         "value": <var_value>,
      #         "type": <var_type>
      #       },
      #       ...
      #     },
      #     ...
      #   }
      # }
      # How to document this using apipie?
      def from_json
        data = params.require(:data).permit!.to_h
        from_hash(data)
      end

      private

      def from_hash(data)
        data.each do |role_name, variables|
          variables.each do |variable_name, variable_data|
            role = find_role(role_name)
            return role if performed?
            existing_variable = AnsibleRole.find_by(name: role_name).ansible_variables.find_by(key: variable_name)
            if existing_variable.nil?
              if !variable_data.key?(:type) || variable_data["type"] == "auto"
                @importer.create_base_variable(variable_name, role, variable_data["value"], @importer.infer_key_type(variable_data["value"])).save
              else
                @importer.create_base_variable(variable_name, role, variable_data["value"], variable_data["type"]).save
              end
            else
              existing_variable.update({ :override => true, :key_type => variable_data["type"], :default_value => variable_data["value"] })
            end
          end
        end
      end

      def encoded_yaml_to_hash(encoded_string)
        loaded_hash = YAML.safe_load(Base64.decode64(encoded_string))
        loaded_hash.each do |variable_name, variable_value|
          loaded_hash[variable_name] = {
            :value => variable_value,
            :type => @importer.infer_key_type(variable_value)
          }
        end
        loaded_hash
      end

      def find_role(role_name)
        role = AnsibleRole.find_by(name: role_name)
        !role.nil? ? role : render_error('custom_error', :status => :unprocessable_entity, :locals => { :message => _("#{role_name} does not exist") })
      end

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
