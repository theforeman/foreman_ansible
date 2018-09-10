# frozen_string_literal: true

module ForemanAnsibleCore
  # Taken from Foreman core, this class creates an error code for any exception
  class Exception < ::StandardError
    def initialize(message, *params)
      @message = message
      @params = params
    end

    def self.calculate_error_code(classname, message)
      return 'ERF00-0000' if classname.nil? || message.nil?
      basename = classname.split(':').last
      class_hash = Zlib.crc32(basename) % 100
      msg_hash = Zlib.crc32(message) % 10_000
      format 'ERF%02d-%04d', class_hash, msg_hash
    end

    def code
      @code ||= Exception.calculate_error_code(self.class.name, @message)
      @code
    end

    def message
      # make sure it works without gettext too
      translated_msg = @message % @params
      "#{code} [#{self.class.name}]: #{translated_msg}"
    end

    def to_s
      message
    end
  end

  class ReadConfigFileException < ForemanAnsibleCore::Exception; end
  class ReadRolesException < ForemanAnsibleCore::Exception; end
end
