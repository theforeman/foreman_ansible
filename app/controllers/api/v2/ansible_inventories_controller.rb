module Api
  module V2
    class AnsibleInventoriesController < ::Api::V2::BaseController
      include ::Api::Version2

      resource_description do
        api_version 'v2'
        api_base_url '/ansible/api'
      end

      api :POST, '/ansible_inventories/hosts',
          N_('Show Ansible inventory for hosts')
      param :host_ids, Array, N_('IDs of hosts included in inventory'),
            :required => true

      api :GET, '/ansible_inventories/hosts',
          N_('Show Ansible inventory for hosts')
      param :host_ids, Array, N_('IDs of hosts included in inventory'),
            :required => true

      def hosts
        show_inventory :host_ids, :id
      end

      api :POST, '/ansible_inventories/hostgroups',
          N_('Show Ansible inventory for hostgroups')
      param :hostgroup_ids, Array, N_('IDs of hostgroups included in inventory'),
            :required => true

      api :GET, '/ansible_inventories/hostgroups',
          N_('Show Ansible inventory for hostgroups')
      param :hostgroup_ids, Array, N_('IDs of hostgroups included in inventory'),
            :required => true

      def hostgroups
        show_inventory :hostgroup_ids, :hostgroup_id
      end

      api :POST, '/ansible_inventories/schedule',
          N_('Schedule generating of Ansible Inventory report')
      param :input_values, Hash, N_('Hash of input values of type input=>value')
      param :report_format, ReportTemplateFormat.selectable.map(&:id),
            N_("Report format, defaults to '%s'") % 'json'
      example <<-EXAMPLE
      POST /ansible/api/ansible_inventories/schedule
      {
        "input_values": {
          "Organization": "yes",
          "Location": "yes",
          "IPv4": "yes",
          "Facts": "no"
        }
      }
      200
      {
        "job_id": UNIQUE-REPORT-GENERATING-JOB-UUID
        "data_url": "/api/v2/report_templates/1/report_data/UNIQUE-REPORT-GENERATING-JOB-UUID"
      }
      EXAMPLE

      def schedule
        @composer = ReportComposer.from_api_params(schedule_params)
        if @composer.valid?
          job = @composer.schedule_rendering
          response = { :job_id => job.provider_job_id }
          response[:data_url] = report_data_api_report_template_path(
            @report_template, :job_id => job.provider_job_id
          )
          render :json => response
        else
          @ansible_inventory = @composer
          process_resource_error(:resource => @ansible_inventory)
        end
      rescue StandardError => e
        render_error :custom_error, :status => :unprocessable_entity,
                                    :locals => { :message => _("Scheduling Report template failed for: #{e.message}") }
      end

      def action_permission
        case params[:action]
        when 'hosts', 'hostgroups'
          :view
        when 'schedule'
          :generate
        else
          super
        end
      end

      private

      def schedule_params
        template_name = Setting::Ansible.find_by(:name => 'ansible_inventory_template').value
        @report_template = ReportTemplate.find_by!(:name => template_name)
        params[:id] = @report_template.id
        params[:report_format] = 'json' if params[:report_format].blank?
        params
      end

      def show_inventory(ids_key, condition_key)
        ids = params.fetch(ids_key, []).uniq
        render :json => ForemanAnsible::InventoryCreator.new(Host.where(condition_key => ids)).to_hash.to_json
      end
    end
  end
end
