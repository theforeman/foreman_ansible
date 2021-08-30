
module ForemanAnsible
  class PlayBookImporter

    def import_playbook
      # Read a playbook example from github, needs to be fixed to read playbooks from certain directory
      uri = URI("https://raw.githubusercontent.com/theforeman/forklift/master/playbooks/luna_demo_environment.yml")
      file = Net::HTTP.get(uri)
      template = JobTemplate.import_raw(File.read(file))
      template
    end

  end
end