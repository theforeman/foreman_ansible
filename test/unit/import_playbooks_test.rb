require 'test_plugin_helper'

class ImportPlaybooksTest < ActiveSupport::TestCase
  let(:ansible_proxy) { FactoryBot.create(:smart_proxy, :with_ansible) }
  let(:proxy_api) { ::ProxyAPI::Ansible.new(url: ansible_proxy.url) }
  subject { ::ForemanAnsible::PlaybooksImporter.new(ansible_proxy) }
  let(:sample_playbooks) { JSON.parse(File.read(ansible_fixture_file('sample_playbooks.json'))) }
  let(:playbook1_output) { sample_playbooks.first }
  let(:playbook2_output) { sample_playbooks.last }
  let(:first_playbook) { ['xprazak2.forklift_collection.foreman_provisioning.yml'] }
  let(:second_playbook) { ['xprazak2.forklift_collection.collect_debug_draft.yml'] }
  let(:playbook1_template) { JSON.parse(File.read(ansible_fixture_file('playbooks_example_output.json')))['template'] }

  setup do
    subject.stubs(:proxy_api).returns(proxy_api)
  end

  describe 'check the job templates that were created due to the import' do
    test 'should just create job templates from playbooks' do
      subject.expects(:playbooks).with(second_playbook).returns([playbook2_output])
      actual = subject.import_playbooks(second_playbook)
      assert_not_nil actual_created = actual[:created]
      assert_equal 1, actual_created.count
      job_template = JobTemplate.where(id: actual_created.keys.first).first
      assert_equal job_template.name, actual_created.values.first
    end
  end

  describe 'check the updated job templated due to import playbooks' do
    test ' should not update an identical job template' do
      FactoryBot.create(:job_template, id: 111, name: playbook1_output['name'],
                                       template: playbook1_template)
      subject.expects(:playbooks).with(first_playbook).returns([playbook1_output])
      actual = subject.import_playbooks(first_playbook)
      assert_not_nil actual_updated =  actual[:updated]
      assert_not_nil actual_created =  actual[:created]
      assert_equal 0, actual_updated.count
      assert_equal 0, actual_created.count
    end

    test ' should just update a job template from playbooks' do
      job_template = FactoryBot.create(:job_template, id: 112, name: playbook2_output['name'], template: 'check')
      subject.expects(:playbooks).with(second_playbook).returns([playbook2_output])
      actual = subject.import_playbooks(second_playbook)
      assert_not_nil actual_updated = actual[:updated]
      assert_equal 1, actual_updated.count
      assert_equal actual_updated.keys.first, job_template.id
      assert_not_nil job_template.template
    end
  end
end
