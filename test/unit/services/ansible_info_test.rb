# frozen_string_literal: true

require 'test_plugin_helper'

class AnsibleInfoTest < ActiveSupport::TestCase
  setup do
    @host = FactoryBot.create(:host)
    @role = FactoryBot.create(:ansible_role)
    @host.ansible_roles << @role
  end

  test 'masks hidden variable values in ansible_params' do
    variable = FactoryBot.create(:ansible_variable,
                                 :ansible_role => @role,
                                 :key => 'secret_var',
                                 :default_value => 'secret_password',
                                 :override => true)
    variable.update(:hidden_value => true)

    info = ForemanAnsible::AnsibleInfo.new(@host)
    params = info.ansible_params

    assert_equal '*****', params['secret_var']
  end

  test 'does not mask non-hidden variable values' do
    variable = FactoryBot.create(:ansible_variable,
                                 :ansible_role => @role,
                                 :key => 'visible_var',
                                 :default_value => 'visible_value',
                                 :override => true)
    variable.update(:hidden_value => false)

    info = ForemanAnsible::AnsibleInfo.new(@host)
    params = info.ansible_params

    assert_equal 'visible_value', params['visible_var']
  end
end
