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
      inherited_role_ids = form_object.inherited_ansible_roles.map(&:id)
      if form_object.is_a?(Hostgroup)
        assoc_roles = form_object.hostgroup_ansible_roles
        assoc_key = :hostgroup_ansible_role_id
      else
        assoc_roles = form_object.host_ansible_roles
        assoc_key = :host_ansible_role_id
      end
      own_roles_attrs = model_roles_attrs(assoc_roles.reject { |ar| inherited_role_ids.include?(ar.ansible_role_id) }, assoc_key)
      roles_attrs(form_object.inherited_ansible_roles) + own_roles_attrs
    end

    def roles_attrs(roles)
      roles.map { |item| { id: item.id, name: item.name } }
    end

    private

    def model_roles_attrs(associated_roles, assoc_key)
      associated_roles.map { |item| { id: item.ansible_role_id, name: item.ansible_role.name, position: item.position }.merge(assoc_key => item.id) }
    end
  end
end
