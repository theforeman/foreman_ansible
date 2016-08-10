module Actions
  module Ansible
    class RunProxyAction < ::Actions::ProxyAction

      def proxy_action_name
        input[:proxy_action_name]
      end

      def on_data(data)
        super(data)
        raise "Execution failed" if failed_run?(data)
      end

      def failed_run?(data)
        data['exit_code'] != 0
      end

      def humanized_name
        _('Play Ansible roles on ')
      end

      def humanized_input
        input['inventory'].keys.join(', ')
      end
    end
  end
end