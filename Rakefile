#!/usr/bin/env rake
# frozen_string_literal: true

begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end

require 'rake/testtask'
Rake::TestTask.new('test:core') do |test|
  test_dir = File.join(File.dirname(__FILE__), 'test/lib')
  test.pattern = "#{test_dir}/**/*_test.rb"
  test.libs << test_dir
  test.verbose = false
  test.warning = false
end

begin
  require 'rubocop/rake_task'
  RuboCop::RakeTask.new
rescue StandardError => _e
  puts 'Rubocop not loaded.'
end

Bundler::GemHelper.install_tasks :name => 'foreman_ansible'

task :default do
  Rake::Task['rubocop'].execute
end
