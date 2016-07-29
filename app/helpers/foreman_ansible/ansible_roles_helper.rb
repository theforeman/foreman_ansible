module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_proxy_links(hash, classes = nil)
      links = SmartProxy.with_features('Ansible').map do |proxy|
        display_link_if_authorized(_('Import from %s') % proxy.name,
                                   hash.merge(:proxy => proxy),
                                   :class => classes)
      end.flatten
      links.unshift display_link_if_authorized(_('Import from Foreman host'),
                                               hash,
                                               :class => classes)
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'), {}, ansible_proxy_links(hash))
    end

    def import_time(role)
      _('%s ago') % time_ago_in_words(role.updated_at)
    end
  end
end
