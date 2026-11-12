import { formatValue } from '../AnsibleVariableOverridesTableHelper';

describe('formatValue', () => {
  it('should mask hidden values', () => {
    const variable = {
      hiddenValue: true,
      defaultValue: 'secret_password',
      currentValue: null,
      parameterType: 'string',
    };
    expect(formatValue(variable)).toBe('*****');
  });

  it('should mask hidden values even when currentValue exists', () => {
    const variable = {
      hiddenValue: true,
      defaultValue: 'default_secret',
      currentValue: { value: 'override_secret' },
      parameterType: 'string',
    };
    expect(formatValue(variable)).toBe('*****');
  });

  it('should show defaultValue when not hidden', () => {
    const variable = {
      hiddenValue: false,
      defaultValue: 'visible_value',
      currentValue: null,
      parameterType: 'string',
    };
    expect(formatValue(variable)).toBe('visible_value');
  });

  it('should show currentValue when not hidden and override exists', () => {
    const variable = {
      hiddenValue: false,
      defaultValue: 'default_value',
      currentValue: { value: 'override_value' },
      parameterType: 'string',
    };
    expect(formatValue(variable)).toBe('override_value');
  });
});
