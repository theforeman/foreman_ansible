module ForemanAnsible
  module SmartProxyExtensions
    extend ActiveSupport::Concern
    included do
      has_many :ansible_roles
    end
  end
end
