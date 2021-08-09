# frozen_string_literal: true

require 'test_plugin_helper'

module ForemanAnsible
  class OverrideResolverTest < ActiveSupport::TestCase
    test 'should return no overrides when no roles assigned to host' do
      assert_empty OverrideResolver.new(FactoryBot.build(:host)).overrides
    end

    test 'should return overrides for host' do
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

    test 'should raise when no host specified' do
      assert_raises Foreman::Exception do
        OverrideResolver.new(nil)
      end
    end
  end
end
