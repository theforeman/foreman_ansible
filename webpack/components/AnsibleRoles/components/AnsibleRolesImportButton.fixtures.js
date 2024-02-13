export const testSmartProxies = [
  {
    created_at: '2024-06-21 14:49:35 +0200',
    updated_at: '2024-06-21 14:49:35 +0200',
    hosts_count: 0,
    name: 'debuggable',
    id: 2,
    url: 'http://smart-proxy-ansible-capable.example.com:8080',
    remote_execution_pubkey: null,
    download_policy: 'on_demand',
    supported_pulp_types: [],
    lifecycle_environments: [],
    features: [
      {
        capabilities: ['ansible-runner', 'single'],
        name: 'Dynflow',
        id: 17,
      },
      {
        capabilities: ['vcs_clone'],
        name: 'Ansible',
        id: 20,
      },
      {
        capabilities: [],
        name: 'Logs',
        id: 13,
      },
    ],
  },
];
