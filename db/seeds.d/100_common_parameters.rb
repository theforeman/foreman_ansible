CommonParameter.without_auditing do
  params = [
    { name: 'ansible_roles_check_mode', key_type: 'boolean', value: false }
  ]

  params.each { |param| CommonParameter.find_or_create_by(param) }
end
