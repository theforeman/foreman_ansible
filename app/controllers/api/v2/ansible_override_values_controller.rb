# frozen_string_literal: true

module Api
  module V2
    # API controller for Ansible Roles
    class AnsibleOverrideValuesController < ::Api::V2::BaseController
      include ::Api::Version2
      include Foreman::Controller::Parameters::AnsibleOverrideValue

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      def_param_group :ansible_override_value do
        param :override_value, Hash, :required => true, :action_aware => true do
          param :match, String, :required => true, :desc => N_("Override match")
          param :value, :any_type, :of => LookupKey::KEY_TYPES, :required => false, :desc => N_("Override value, required if omit is false")
        end
      end

      api :POST, "/ansible_override_values/", N_("Create an override value for a specific ansible variable")
      param :ansible_variable_id, :identifier, :required => true
      param_group :ansible_override_value, :as => :create

      def create
        @ansible_variable = AnsibleVariable.authorized(:edit_external_variables).
                            find_by(:id => params[:ansible_variable_id].to_i)
        @override_value = @ansible_variable.lookup_values.create!(lookup_value_params['override_value'])
        @ansible_variable.update_attribute(:override, true)
        render 'api/v2/ansible_override_values/show'
      end

      api :DELETE, "/ansible_override_values/:id", N_("Destroy an override value")
      param :id, :identifier, :required => true

      def destroy
        @override_value = LookupValue.find_by(:id => params[:id])
        if @override_value
          @ansible_variable = AnsibleVariable.where(:id => @override_value.lookup_key_id)
          @override_value.destroy
          render 'api/v2/ansible_override_values/show'
        else
          not_found
        end
      end

      def resource_name
        'ansible_variable'
      end
    end
  end
end
