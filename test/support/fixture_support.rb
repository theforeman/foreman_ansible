module ForemanAnsible
  module PluginFixtures
    FIXTURE_MAPPING = {
      :ansible_permissions => :permissions
    }.freeze

    def self.add_fixtures(new_fixture_path)
      FileUtils.cp(Dir.glob("#{Rails.root}/test/fixtures/*"), new_fixture_path)
      copy_plugin_fixtures new_fixture_path
    end

    def self.copy_plugin_fixtures(new_fixture_path)
      FIXTURE_MAPPING.each  do |key, value|
        fixture_path = "#{ForemanAnsible::Engine.root}/test/fixtures/#{key}.yml"
        return unless File.exists?(fixture_path)
        File.open("#{new_fixture_path}/#{value}.yml", 'a') do |file|
          File.open(fixture_path, 'r').each do |line|
            next if line =~ /---/
            file.write line
          end
        end
      end
    end
  end
end
