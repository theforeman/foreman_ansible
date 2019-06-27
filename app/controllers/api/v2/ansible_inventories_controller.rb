module Api
  module V2
    class AnsibleInventoriesController < ::Api::V2::BaseController
      include ::Api::Version2

      api :POST, '/ansible_inventories/hosts',
      N_('Show Ansible inventory for hosts')
      param :host_ids, Array, N_('IDs of hosts included in inventory'),
            :required => true

      api :GET, '/ansible_inventories/hosts',
      N_('Show Ansible inventory for hosts')
      param :host_ids, Array, N_('IDs of hosts included in inventory'),
            :required => true

      api :POST, '/ansible_inventories/hostgroups',
      N_('Show Ansible inventory for hostgroups')
      param :hostgroup_ids, Array, N_('IDs of hostgroups included in inventory'),
            :required => true

      api :GET, '/ansible_inventories/hostgroups',
      N_('Show Ansible inventory for hostgroups')
      param :hostgroup_ids, Array, N_('IDs of hostgroups included in inventory'),
            :required => true

      def hosts
        show_inventory :host_ids, :id
      end

      def hostgroups
        show_inventory :hostgroup_ids, :hostgroup_id
      end

      def action_permission
        case params[:action]
        when 'hosts', 'hostgroups'
          :view
        else
          super
        end
      end

      private

      def show_inventory(ids_key, condition_key)
        ids = params.fetch(ids_key, []).uniq
        render :json => ForemanAnsible::InventoryCreator.new(Host.where(condition_key => ids)).to_hash.to_json
      end
    end
  end
end
