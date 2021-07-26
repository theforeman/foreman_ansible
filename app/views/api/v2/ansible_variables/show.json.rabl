object @ansible_variable

attribute :parameter
attributes :id, :variable, :ansible_role, :ansible_role_id, :description, :override,
           :variable_type, :hidden_value?, :validator_type,
           :validator_rule, :merge_overrides, :merge_default,
           :avoid_duplicates, :override_value_order, :created_at, :updated_at,
           :default_value, :imported

node do |ansible_variable|
  {
    :override_values => partial(
      'api/v2/ansible_override_values/index',
      :object => ansible_variable.lookup_values
    )
  }
end

node :override_values_count do |lk|
  lk.lookup_values.count
end
