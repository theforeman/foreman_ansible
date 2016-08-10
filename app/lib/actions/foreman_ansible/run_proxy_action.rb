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

    end
  end
end