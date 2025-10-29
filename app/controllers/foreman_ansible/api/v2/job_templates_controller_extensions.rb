# frozen_string_literal: true

module ForemanAnsible
  module Api
    module V2
      # Extends the job_templates api controller to support creating/updating with ansible callback plugin
      module JobTemplatesControllerExtensions
        extend Apipie::DSL::Concern

        update_api(:create, :update) do
          param :job_template, Hash do
            param :ansible_callback_enabled, :bool, :desc => N_('Enable the callback plugin for this template')
            param :ansible_check_mode, :bool, :desc => N_('Enable Ansible Check Mode for this template')
            param :ansible_diff_mode, :bool, :desc => N_('Enable Ansible Diff Mode for this template')
          end
        end
      end
    end
  end
end
