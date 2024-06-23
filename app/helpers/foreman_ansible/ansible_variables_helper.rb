# frozen_string_literal: true

module ForemanAnsible
  module AnsibleVariablesHelper
    def yaml_import
      return '' unless authorized_for({ :controller => :ansible_variables, :action => :new })
      select_action_button('',
                           { :primary => true, :class => 'yaml-import' },
                           link_to(_('Import from YAML-File'), '#yaml_import'))
    end
  end
end
