class Setting::Ansible < ::Setting
  def self.load_defaults
    return unless super
    self.transaction do
      [
        self.set('ansible_port', N_('Foreman will use this port to ssh into hosts for running playbooks'), 22, N_('Default port')),
        self.set('ansible_user', N_('Foreman will try to connect as this user to hosts when running Ansible playbooks.'), 'root', N_('Default user')),
        self.set('ansible_ssh_pass', N_('Foreman will use this password when running Ansible playbooks.'), 'ansible', N_('Default password'))
      ].compact.each { |s| self.create s.update(:category => 'Setting::Ansible') }
    end

    true
  end

  def self.humanized_category
    N_('Ansible')
  end
end
