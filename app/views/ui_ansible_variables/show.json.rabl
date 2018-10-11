object @ansible_variable

attributes :parameter, :id, :override, :description, :parameter_type,
           :hidden_value?, :omit, :required, :validator_type, :validator_rule,
           :default_value

node do |ansible_variable|
 {
   :override_values => partial(
     'api/v2/override_values/index',
     :object => ansible_variable.lookup_values
   )
 }
end

node(:current_override) do |ansible_variable|
  @override_resolver.resolve ansible_variable
end
