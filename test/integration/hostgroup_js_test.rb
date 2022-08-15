require_relative '../test_plugin_helper'
require 'integration_test_helper'

class HostgroupJsTest < IntegrationTestWithJavascript
  let(:hostgroup) { FactoryBot.create(:hostgroup, :name => 'HostgroupWithoutRoles') }
  let(:hostgroup_with_roles) { FactoryBot.create(:hostgroup, :with_ansible_roles, :name => 'HostgroupWithRoles') }

  setup do
    FactoryBot.create(:host, :hostgroup_id => hostgroup.id)
    FactoryBot.create(:host, :hostgroup_id => hostgroup_with_roles.id)
  end

  test 'hostgroup without roles should have disabled link' do
    visit hostgroups_path(search: hostgroup.name)

    first_row = page.find('table > tbody > tr:nth-child(1)')
    first_row.find('td:nth-child(4) > div > a').click

    assert_includes first(:link, 'Run all Ansible roles')[:class], 'disabled'
  end

  test 'hostgroup with roles should have clickable link' do
    visit hostgroups_path(search: hostgroup_with_roles.name)

    first_row = page.find('table > tbody > tr:nth-child(1)')
    first_row.find('td:nth-child(4) > div > a').click

    assert_not first(:link, 'Run all Ansible roles')[:class].include?('disabled')
  end
end
