# frozen_string_literal: true

proxy_feature = Feature.where(:name => 'Ansible').first_or_create
if proxy_feature.nil? || proxy_feature.errors.any?
  raise "Unable to create proxy feature: #{format_errors proxy_feature}"
end
