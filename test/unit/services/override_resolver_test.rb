# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAnsible
  class OverrideResolverTest < ActiveSupport::TestCase
    test 'should return no overrides when no roles assigned to host' do
      assert_empty OverrideResolver.new(FactoryBot.build(:host)).overrides
    end

    test 'should return no overrides when no roles assigned to hostgroup' do
      assert_empty OverrideResolver.new(FactoryBot.build(:hostgroup)).overrides
    end

    test 'should return overrides for existing host' do
      first_role = FactoryBot.create(:ansible_role)
      first_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => first_role)
      second_role = FactoryBot.create(:ansible_role)
      second_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => second_role)
      host = FactoryBot.create(:host, :ansible_roles => [first_role])
      another_host = FactoryBot.create(:host)

      FactoryBot.create(:lookup_value, :match => "fqdn=#{host.name}", :lookup_key_id => first_var.id)
      FactoryBot.create(:lookup_value, :match => "fqdn=#{another_host.name}", :lookup_key_id => first_var.id)
      FactoryBot.create(:lookup_value, :match => "fqdn=#{host.name}", :lookup_key_id => second_var.id)

      assert_not_nil OverrideResolver.new(host).resolve(first_var)
      assert_nil OverrideResolver.new(another_host).resolve(first_var)
      assert_nil OverrideResolver.new(host).resolve(second_var)
    end

    test 'should return overrides for existing hostgroup without parent' do
      first_role = FactoryBot.create(:ansible_role)
      first_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => first_role)
      hostgroup = FactoryBot.create(:hostgroup, :ansible_roles => [first_role])

      second_role = FactoryBot.create(:ansible_role)
      second_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => second_role)
      another_hostgroup = FactoryBot.create(:hostgroup)

      FactoryBot.create(:lookup_value, :match => "hostgroup=#{hostgroup.name}", :lookup_key_id => first_var.id)
      FactoryBot.create(:lookup_value, :match => "hostgroup=#{another_hostgroup.name}", :lookup_key_id => first_var.id)
      FactoryBot.create(:lookup_value, :match => "hostgroup=#{hostgroup.name}", :lookup_key_id => second_var.id)

      assert_not_nil OverrideResolver.new(hostgroup).resolve(first_var)
      assert_nil OverrideResolver.new(another_hostgroup).resolve(first_var)
      assert_nil OverrideResolver.new(hostgroup).resolve(second_var)
    end

    test 'should return overrides for existing hostgroup inheriteded from parent' do
      first_role = FactoryBot.create(:ansible_role)
      first_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => first_role)

      parent = FactoryBot.create(:hostgroup, :ansible_roles => [first_role])
      hostgroup = FactoryBot.create(:hostgroup, :parent_id => parent.id)

      second_role = FactoryBot.create(:ansible_role)
      second_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => second_role)
      another_hostgroup = FactoryBot.create(:hostgroup)

      FactoryBot.create(:lookup_value, :match => "hostgroup=#{parent.name}", :lookup_key_id => first_var.id)
      FactoryBot.create(:lookup_value, :match => "hostgroup=#{another_hostgroup.name}", :lookup_key_id => first_var.id)
      FactoryBot.create(:lookup_value, :match => "hostgroup=#{parent.name}", :lookup_key_id => second_var.id)

      assert_not_nil OverrideResolver.new(hostgroup).resolve(first_var)
      assert_nil OverrideResolver.new(another_hostgroup).resolve(first_var)
      assert_nil OverrideResolver.new(hostgroup).resolve(second_var)
    end

    test 'should return overrides for existing hostgroup not inherited from parent' do
      first_role = FactoryBot.create(:ansible_role)
      first_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => first_role)

      parent = FactoryBot.create(:hostgroup, :ansible_roles => [first_role])
      hostgroup = FactoryBot.create(:hostgroup, :parent_id => parent.id)

      second_role = FactoryBot.create(:ansible_role)
      second_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => second_role)
      another_hostgroup = FactoryBot.create(:hostgroup)

      FactoryBot.create(:lookup_value, :match => "hostgroup=#{parent.name}", :lookup_key_id => first_var.id, :value => 'foo')
      lookup_value = FactoryBot.create(:lookup_value, :match => "hostgroup=#{hostgroup.title}", :lookup_key_id => first_var.id, :value => 'bar')
      FactoryBot.create(:lookup_value, :match => "hostgroup=#{parent.name}", :lookup_key_id => second_var.id)

      resolver = OverrideResolver.new(hostgroup)

      override = resolver.resolve(first_var)
      assert_equal hostgroup.name, override[:element_name]
      assert_equal lookup_value.value, override[:value]
      assert_nil OverrideResolver.new(another_hostgroup).resolve(first_var)
      assert_nil resolver.resolve(second_var)
    end

    test 'should return override for new host with hostgroup based on os' do
      host_os = FactoryBot.create(:operatingsystem)
      hostgroup_os = FactoryBot.create(:operatingsystem)
      first_role = FactoryBot.create(:ansible_role)
      first_var = FactoryBot.create(:ansible_variable, :override => true, :ansible_role => first_role)
      hostgroup = FactoryBot.create(:hostgroup, :ansible_roles => [first_role], :operatingsystem => hostgroup_os)
      host = FactoryBot.build(:host, :hostgroup => hostgroup, :operatingsystem => host_os)
      assert_nil host.id

      FactoryBot.create(:lookup_value, :match => "os=#{hostgroup_os.title}", :lookup_key_id => first_var.id, :value => 'foo')
      lookup_value = FactoryBot.create(:lookup_value, :match => "os=#{host_os.title}", :lookup_key_id => first_var.id, :value => 'bar')

      resolver = OverrideResolver.new(host)

      override = resolver.resolve(first_var)
      assert_equal host_os.title, override[:element_name]
      assert_equal lookup_value.value, override[:value]
    end
  end
end
