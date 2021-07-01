require 'test_plugin_helper'

module Api
  module V2
    class ConfigReportsControllerTest < ActionController::TestCase
      let(:example_report) do
        JSON.parse(File.read(ansible_fixture_file('report.json')))
      end

      context 'host with a registered smart proxy with only Ansible enabled' do
        let(:smart_proxy) { FactoryBot.create(:smart_proxy, :ansible, url: 'http://configreports.foreman') }

        test 'should create a report successfully' do
          Setting[:restrict_registered_smart_proxies] = true
          Setting[:require_ssl_smart_proxies] = false

          host = URI.parse(smart_proxy.url).host
          Resolv.any_instance.stubs(:getnames).returns([host])
          post :create, params: { :config_report => example_report }
          assert_equal smart_proxy, @controller.detected_proxy
          assert_response :created
        end
      end
    end
  end
end
