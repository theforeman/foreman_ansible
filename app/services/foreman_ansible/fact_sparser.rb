module ForemanAnsible
  class FactSparser
    class << self
      def sparse(hash, options = {} )
        hash.map do |k, v|
          prefix = options.fetch(:prefix, []) + [k]
          next sparse(v, options.merge(:prefix => prefix)) if v.is_a? Hash
          { prefix.join(options.fetch(:separator, FactName::SEPARATOR)) => v }
        end.reduce(:merge) || Hash.new
      end

      def unsparse(hash, options={})
        ret = Hash.new
        sparse(hash).each do |k, v|
          current = ret
          key = k.to_s.split(options.fetch(:separator, FactName::SEPARATOR))
          current = (current[key.shift] ||= Hash.new) until key.size <= 1
          current[key.first] = v
        end
        ret
      end
    end
  end
end
