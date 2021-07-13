class OverridenAnsibleVariablePresenter
  attr_reader :ansible_variable

  delegate :id, :key, :description, :override?,
           :parameter_type, :hidden_value?, :omit, :required,
           :validator_type, :validator_rule, :default_value, :to => :ansible_variable

  def initialize(ansible_variable, override_resolver)
    @ansible_variable = ansible_variable
    @override_resolver = override_resolver
  end

  def current_value
    result = @override_resolver.resolve @ansible_variable
    add_meta result
  end

  private

  def known_type_class(element)
    return unless element.is_a? String
    return Operatingsystem if element == 'os'
    element.classify.safe_constantize
  end

  def add_meta(result)
    return unless result
    type = known_type_class(result[:element])
    return result unless type
    attribute = type.attribute_names.include?('title') ? :title : :name
    object = type.find_by attribute => result[:element_name]
    return result unless object
    result[:meta] = {
      :can_edit => User.current.can?(object.permission_name(:edit), object)
    }
    result
  end
end
