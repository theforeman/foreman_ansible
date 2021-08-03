module Types
  class AnsibleRole < BaseObject
    description 'Ansible role'

    global_id_field :id

    field :name, String, :null => false
    field :ansible_variables_with_overrides, Types::OverridenAnsibleVariable.connection_type, :null => false do
      argument :host_id, Integer, 'Host Id', required: true
    end

    def ansible_variables_with_overrides(host_id:)
      host = ::Host.authorized.find_by :id => host_id
      return [] unless host
      context[:ansible_overrides_resolver] ||= ::ForemanAnsible::OverrideResolver.new(host)

      scope = lambda do |sc|
        sc.where(:override => true)
      end

      CollectionLoader.for(object.class, :ansible_variables, scope).load(object).then do |vars|
        vars.map { |variable| ::OverridenAnsibleVariablePresenter.new variable, context[:ansible_overrides_resolver] }
      end
    end
  end
end
