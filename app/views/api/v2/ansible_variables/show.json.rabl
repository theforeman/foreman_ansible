# frozen_string_literal: true

object @ansible_variable

attribute :parameter
attributes :id, :ansible_role, :description, :override, :parameter_type,
           :hidden_value?, :omit, :required, :validator_type, :validator_rule,
           :merge_overrides, :merge_default, :avoid_duplicates,
           :override_value_order, :created_at, :updated_at

node do |ansible_variable|
  {
    :override_values => partial(
      'api/v2/override_values/index',
      :object => ansible_variable.lookup_values
    )
  }
end

node :override_values_count do |lk|
  lk.lookup_values.count
end
