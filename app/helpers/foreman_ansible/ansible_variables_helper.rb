# frozen_string_literal: true

module ForemanAnsible
  # Helper methods for host and hostgroup varibales
  module AnsibleVariablesHelper
    def ansible_lookup_key_with_diagnostic(obj, values_hash, lookup_key, lookup_value)
      value, matcher = ansible_value_matcher(obj, values_hash, lookup_key)
      inherited_value = LookupKey.format_value_before_type_cast(value, lookup_key.key_type)
      effective_value = lookup_value.lookup_key_id.nil? ? inherited_value.to_s : lookup_value.value_before_type_cast.to_s
      warnings = lookup_key_warnings(lookup_key.required, effective_value.present?)
      popover_value = lookup_key.hidden_value? ? lookup_key.hidden_value : inherited_value

      parameter_value_content(
        "#{parameters_receiver}_lookup_values_attributes_#{lookup_key.id}_value",
        effective_value,
        :popover => diagnostic_popover(lookup_key, matcher, popover_value, warnings),
        :name => "#{lookup_value_name_prefix(lookup_key.id)}[value]",
        :disabled => !lookup_key.overridden?(obj) || lookup_value.omit || !can_edit_params?,
        :inherited_value => inherited_value,
        :lookup_key => lookup_key,
        :hidden_value? => lookup_key.hidden_value?,
        :lookup_key_type => lookup_key.key_type
      )
    end

    def ansible_value_matcher(obj, values_hash, lookup_key)
      if parameters_receiver == "host"
        value = values_hash[lookup_key.id]
        value_for_key = value.try(:[], lookup_key.key)
        if value_for_key.present?
          [value_for_key[:value], "#{value_for_key[:element]} (#{value_for_key[:element_name]})"]
        else
          [lookup_key.default_value, _("Default value")]
        end
      else # hostgroup
        obj.inherited_lookup_value(lookup_key)
      end
    end
  end
end

