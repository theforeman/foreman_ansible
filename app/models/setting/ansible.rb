class Setting::Ansible < ::Setting
  def self.load_defaults
    return unless super
    self.transaction do
      [
        self.set('ansible_port', N_('Foreman will use this port to ssh into hosts for running playbooks'), 22, N_('Default port')),
        self.set('ansible_user', N_('Foreman will try to connect as this user to hosts when running Ansible playbooks.'), 'root', N_('Default user')),
        self.set('ansible_ssh_pass', N_('Foreman will use this password when running Ansible playbooks.'), 'ansible', N_('Default password')),
        self.set('ansible_connection', N_('Foreman will use configured connection type when running Ansible playbooks.'), 'ssh', N_('Default Connection Type')),
        self.set('ansible_winrm_server_cert_validation', N_('Foreman will enable/disable WinRM server certificate validation when running Ansible playbooks.'), 'validate', N_('Default WinRM Cert Validation'))
      ].compact.each { |s| self.create s.update(:category => 'Setting::Ansible') }
    end

    true
  end

  def self.humanized_category
    N_('Ansible')
  end
end
