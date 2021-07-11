import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnsibleHostInventory from './AnsibleHostInventory';

const inventoryData = {
  all: {
    hosts: ['jim-dorsay.tlv.redhat.com'],
    vars: {},
  },
  _meta: {
    hostvars: {
      'jim-dorsay.tlv.redhat.com': {
        foreman: {
          hostname: 'jim-dorsay',
          fqdn: 'jim-dorsay.tlv.redhat.com',
          hostgroup: 'libvirt',
          foreman_subnets: [
            {
              name: 'subnet',
              network: '192.168.122.0',
              mask: '255.255.255.0',
              gateway: '',
              dns_primary: '',
              dns_secondary: '',
              from: '',
              to: '',
              boot_mode: 'DHCP',
              ipam: 'DHCP',
              vlanid: null,
              mtu: 1500,
              nic_delay: null,
              network_type: 'IPv4',
              description: '',
            },
          ],
          foreman_interfaces: [
            {
              ip: '192.168.122.139',
              ip6: '',
              mac: '52:54:00:bd:01:0d',
              name: 'jim-dorsay.tlv.redhat.com',
              attrs: {},
              virtual: false,
              link: true,
              identifier: '',
              managed: true,
              primary: true,
              provision: true,
              subnet: {},
              subnet6: null,
              tag: null,
              attached_to: null,
              type: 'Interface',
            },
          ],
          location: 'Default Location',
          location_title: 'Default Location',
          organization: 'Default Organization',
          organization_title: 'Default Organization',
          domainname: 'tlv.redhat.com',
          foreman_domain_description: '',
          owner_name: 'Admin User',
          owner_email: 'root@localdomain',
          ssh_authorized_keys: [],
          foreman_users: {
            admin: {
              firstname: 'Admin',
              lastname: 'User',
              mail: 'root@localdomain',
              description: '',
              fullname: 'Admin User',
              name: 'admin',
              ssh_authorized_keys: [],
            },
          },
          root_pw:
            '$5$I6cmWY8Uy4NaTfqW$wkKsQzinnd2iNTHvYPYPxO/YkHlvT/sgVF1n6paZvd8',
          foreman_config_groups: [],
          puppetmaster: '',
        },
        foreman_ansible_roles: ['foreman_ansible_test'],
        ansible_roles_check_mode: false,
        host_packages: '',
        host_registration_insights: false,
        host_registration_remote_execution: true,
        remote_execution_ssh_keys: [
          'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC6ERZ9H22Di8mHRcxoTyIc+kcKCpGYq6G4/Ub9WK+DZlZZNMXCcO0WydV9GyJX9eIGrStDxZvxtJQQoOvYRS8d92RZPy3wIR4GtingmVNpwehNePHAcF1Aj9nqm+A4V49R3PqC28ctzBaJAbrvnNh/xDCsTW/ogexu8yN4iKkt0ZijUTnAZ2w1dXit23iITm0I8NPYqxRFNQOYtLYBZDKX+rPanjkyYGEyvi/RkhhHOimMjhAR0Qo9Vqm438LZWrZzGAffiE3AVYBWd3Eh2B5nW1q4cmS7CYOfsQCmO9u9x9lFzZCfdIFVWBhSyqR7cw/M7rTmixUNoX3QvSM0A+z/pBx++SgB+LhV2Zmek68NvcG/9LElD3pVESyvqtRbQQtb7Y6e553QUBn4lOg/N/p67TzfySCm0QhU5dKyj52Bvg6yhrwvqbVw1lwpjf6CNLERcRsTomIUDLVzDdcxo+u5GZ2J/hi5xH7NNMT89oPErwChm8wUDQyAdKGntCFP4D8= yifatfanimakias@localhost.localdomain',
        ],
        remote_execution_ssh_user: 'root',
        remote_execution_effective_user_method: 'sudo',
        remote_execution_connect_by_ip: false,
      },
    },
  },
};

describe('AnsibleHostInventory', () => {
  it('should show inventory', () => {
    render(<AnsibleHostInventory inventoryData={inventoryData} />);
    expect(screen.getByText('_meta:')).toBeInTheDocument();
    expect(screen.getByText('all:')).toBeInTheDocument();
  });
});
