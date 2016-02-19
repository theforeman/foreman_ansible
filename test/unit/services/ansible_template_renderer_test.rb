module ForemanAnsible
  class AnsibleTemplateRendererTest < ActiveSupport::TestCase
    test 'builds an inventory using the host name' do
      host = FactoryGirl.build_stubbed(:host)
      renderer = AnsibleTemplateRenderer.new(nil, host)
      renderer.expects(:target_hosts).returns([host]).twice
      assert_equal renderer.inventory, "#{host.name} \n"
    end

    test 'builds an inventory using the host parameters' do
      host = FactoryGirl.build_stubbed(:host)
      stubbed_parameter = FactoryGirl.build_stubbed(:host_parameter)
      host.expects(:parameters).returns([stubbed_parameter]).at_least_once
      renderer = AnsibleTemplateRenderer.new(nil, host)
      renderer.expects(:target_hosts).returns([host]).at_least_once
      assert_equal(renderer.inventory,
                   "#{host.name} "\
                   "#{host.parameters.first.name}="\
                   "#{host.parameters.first.value}\n")
    end

    context 'with hostgroup' do
      setup do
        @host = FactoryGirl.build_stubbed(:host, :with_hostgroup)
      end

      test 'builds an inventory using the host hostgroup' do
        renderer = AnsibleTemplateRenderer.new(nil, @host)
        renderer.expects(:target_hosts).returns([@host]).times(3)
        assert_equal(renderer.inventory,
                     "#{@host.name} \n"\
                     "[#{@host.hostgroup.title}]\n"\
                     "#{@host.name}\n"\
                     "[#{@host.hostgroup.title}:vars]\n\n")
      end

      test 'builds an inventory using the host hostgroup params' do
        @host.hostgroup.expects(:parameters).returns('a' => 'b').at_least_once
        renderer = AnsibleTemplateRenderer.new(nil, @host)
        renderer.expects(:target_hosts).returns([@host]).at_least_once
        assert_equal(renderer.inventory,
                     "#{@host.name} \n"\
                     "[#{@host.hostgroup.title}]\n"\
                     "#{@host.name}\n"\
                     "[#{@host.hostgroup.title}:vars]\n"\
                     "a=b\n\n")
      end
    end
  end
end
