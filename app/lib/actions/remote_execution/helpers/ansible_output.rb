if defined? ForemanRemoteExecution
  module Actions
    module RemoteExecution
      module Helpers
        module AnsibleOutput
          def parse_output_with_data(output_part)
            output_data = output_part['output']['data']

            result = if output_data != 'data'
                       invocation_data_output(output_data)
                     end
            output_part.merge('output' => "#{output_part['output']['category']}: \
                              #{invocation_data(output_data)['module_name']} \
                              #{invocation_data(output_data)['module_args']}: #{result}")
          end

          def invocation_data_output(output_data)
            if invocation_data(output_data)['module_name'] == 'setup'
              'gathering facts'
            else
              JSON.pretty_generate(
                output_data.except('invocation', 'verbose_always').to_hash)
            end
          end

          private

          def invocation_data(output_data)
            output_data['invocation'] || {}
          end
        end
      end
    end
  end
end
