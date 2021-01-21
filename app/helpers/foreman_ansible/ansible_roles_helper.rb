# frozen_string_literal: true

module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_proxy_links(hash, classes = nil)
      SmartProxy.with_features('Ansible').map do |proxy|
        display_link_if_authorized(_('Import from %s') % proxy.name,
                                   hash.merge(:proxy => proxy),
                                   :class => classes)
      end.flatten
    end

    def ansible_role_select(f, persisted)
      blank_opt = persisted ? {} : { :include_blank => true }
      select_items = persisted ? [f.object.ansible_role] : AnsibleRole.order(:name)
      select_f f,
               :ansible_role_id,
               select_items,
               :id,
               :to_label,
               blank_opt,
               :label => _("Ansible Role"),
               :disabled => persisted,
               :required => true
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'),
                           { :primary => true, :class => 'roles-import' },
                           ansible_proxy_links(hash))
    end

    def import_time(role)
      _('%s ago') % time_ago_in_words(role.updated_at)
    end

    def role_attributes_for_roles_switcher(form_object)
      if form_object.is_a?(Hostgroup)
        model_roles_attrs(form_object, HostgroupAnsibleRole, :hostgroup_id, :hostgroup_ansible_role_id)
      else
        model_roles_attrs(form_object, HostAnsibleRole, :host_id, :host_ansible_role_id)
      end
    end

    def roles_attrs(roles)
      roles.map { |item| { :id => item.id, :name => item.name } }
    end

    def model_roles_attrs(form_object, assoc_class, foreign_key, assoc_key)
      inherited_attrs = roles_attrs form_object.inherited_ansible_roles_ordered

      own_attrs = assoc_class.includes(:ansible_role).
                  where(foreign_key => form_object.id).
                  where.not(:ansible_roles => { :id => form_object.inherited_ansible_roles.pluck(:id) }).
                  order(:position).
                  map do |join_record|
        { :id => join_record.ansible_role_id, assoc_key => join_record.id, :name => join_record.ansible_role.name, :position => join_record.position }
      end
      inherited_attrs + own_attrs
    end
  end
end
