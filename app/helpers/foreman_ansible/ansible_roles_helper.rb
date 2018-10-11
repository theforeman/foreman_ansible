# frozen_string_literal: true

module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_proxy_links(hash, classes = nil)
      SmartProxy.with_features('Ansible').map do |proxy|
        display_link_if_authorized(_('From %s') % proxy.name,
                                   hash.merge(:proxy => proxy),
                                   :class => classes)
      end.flatten
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'),
                           { :primary => true, :class => 'roles-import' },
                           ansible_proxy_links(hash))
    end

    def import_time(role)
      _('%s ago') % time_ago_in_words(role.updated_at)
    end

    def roles_attrs(roles)
      roles.map { |item| ({ :id => item.id, :name => item.name }) }
    end
  end
end
