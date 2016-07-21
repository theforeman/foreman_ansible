if defined? ForemanRemoteExecution
  module ForemanAnsible
    class AnsibleProvider < RemoteExecutionProvider
      def self.humanized_name
        'Ansible'
      end
    end
  end
end
