module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_proxy_links(hash, classes = nil)
      links = SmartProxy.with_features('Ansible').map do |proxy|
        display_link_if_authorized(_('From %s') % proxy.name,
                                   hash.merge(:proxy => proxy),
                                   :class => classes)
      end.flatten
      host_text = if links.any?
                    _('From Foreman host')
                  else
                    _('Import from Foreman host')
                  end
      links.unshift display_link_if_authorized(host_text,
                                               hash,
                                               :class => classes)
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'),
                           { :primary => true, :class => 'roles-import' },
                           ansible_proxy_links(hash))
    end

    def import_time(role)
      _('%s ago') % time_ago_in_words(role.updated_at)
    end
  end
end
