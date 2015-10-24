# Ensure that module is namespaced with plugin name
module ForemanPluginTemplate

  # Example: Plugin's HostsController inherits from Foreman's HostsController
  class HostsController < ::HostsController

    # change layout if
    # layout 'foreman_plugin_template/layouts/new_layout'

  #  def new_action
      # automatically renders view/foreman_plugin_template/hosts/new_action
	#  end

  end
end
