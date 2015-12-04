module ForemanAnsible
  # See sparse and unsparse documentation
  class FactSparser
    class << self
      # Sparses facts, so that it converts a facts hash
      # { operatingsystem : { major: 20, name : 'fedora' }
      # into
      # { operatingsystem::major: 20,
      #   operatingsystem::name: 'fedora' }
      def sparse(hash, options = {})
        hash.map do |k, v|
          prefix = options.fetch(:prefix, []) + [k]
          next sparse(v, options.merge(:prefix => prefix)) if v.is_a? Hash
          { prefix.join(options.fetch(:separator, FactName::SEPARATOR)) => v }
        end.reduce(:merge) || {}
      end

      # Unsparses facts, so that it converts a hash with facts
      # { operatingsystem::major: 20,
      #   operatingsystem::name: 'fedora' }
      # into
      # { operatingsystem : { major: 20, name: 'fedora' } }
      def unsparse(hash, options = {})
        ret = {}
        sparse(hash).each do |k, v|
          current = ret
          key = k.to_s.split(options.fetch(:separator, FactName::SEPARATOR))
          current = (current[key.shift] ||= {}) until key.size <= 1
          current[key.first] = v
        end
        ret
      end
    end
  end
end
