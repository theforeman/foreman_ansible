import {
  rectangleLookupKey,
  ellipseLookupKey,
  triangleLookupKey,
} from '../../AnsibleHostParams.fixtures';

import {
  initLookupValue,
  shouldDestroy,
  shouldAddFields,
  lookupKeyValidations,
} from '../AnsibleVariableHelpers';

describe('AnsibleVariableHelpers', () => {
  describe('initLookupValue', () => {
    test('should initialize new lookup value', () => {
      const lookupValue = initLookupValue(ellipseLookupKey, {
        resourceName: 'host',
      });
      expect(lookupValue.value).toBe(lookupValue.defaultValue);
      expect(lookupValue.element).toBe('fqdn');
    });

    test('should find lookup value based on match', () => {
      const lookupValue = initLookupValue(triangleLookupKey, {
        resourceName: 'hostgroup',
      });
      expect(lookupValue.value).toBe(triangleLookupKey.currentOverride.value);
      expect(lookupValue.id).toBe(31);
    });

    test('should return current override', () => {
      const lookupValue = initLookupValue(rectangleLookupKey, {
        resourceName: 'host',
      });
      expect(lookupValue.value).toBe(rectangleLookupKey.currentOverride.value);
      expect(lookupValue.id).toBeFalsy();
    });
  });

  describe('shouldDestroy', () => {
    test('should destroy lookup value', () => {
      expect(shouldDestroy({ overriden: true }, true, false)).toBeTruthy();
    });

    test('should not destroy lookup value when not overriden', () => {
      expect(shouldDestroy({ overriden: false }, true, false)).toBeFalsy();
    });

    test('should not destroy lookup value when field is enabled', () => {
      expect(shouldDestroy({ overriden: true }, false, false)).toBeFalsy();
    });

    test('should not destroy lookup value when field is ommited', () => {
      expect(shouldDestroy({ overriden: true }, true, true)).toBeFalsy();
    });
  });

  describe('shouldAddFields', () => {
    test('should add fields when enabled', () => {
      expect(shouldAddFields({ overriden: false }, false, false)).toBeTruthy();
    });

    test('should add fields when ommited', () => {
      expect(shouldAddFields({ overriden: false }, true, true)).toBeTruthy();
    });

    test('should add fields when overriden and disabled', () => {
      expect(shouldAddFields({ overriden: true }, true, false)).toBeTruthy();
    });
  });

  describe('lookupKeyValidations', () => {
    test('should not show errors when disabled', () => {
      const res = lookupKeyValidations({}, 'foo', true, null, false);
      expect(res.valid).toBeTruthy();
    });

    test('should show errors on load', () => {
      const res = lookupKeyValidations(
        {},
        'foo',
        false,
        { errors: { value: 'has already been taken', id: 'is not unique' } },
        false
      );
      expect(res.valid).toBeFalsy();
      expect(res.msg).toBe('has already been taken, is not unique');
    });

    test('should be valid when not required', () => {
      const res = lookupKeyValidations({}, 'foo', false, null, true);
      expect(res.valid).toBeTruthy();
    });

    test('should not be valid when required without validator and value', () => {
      const res = lookupKeyValidations(
        { required: true, validatorType: 'None' },
        '',
        false,
        null,
        true
      );
      expect(res.valid).toBeFalsy();
      expect(res.msg).toBe("Value can't be blank");
    });

    test('should be valid when required and matching regex', () => {
      const res = lookupKeyValidations(
        { required: true, validatorType: 'regexp', validatorRule: 'bar' },
        'barbarian',
        false,
        null,
        true
      );
      expect(res.valid).toBeTruthy();
    });

    test('should not be valid when required and not matching regex', () => {
      const res = lookupKeyValidations(
        { required: true, validatorType: 'regexp', validatorRule: 'bar' },
        'foofarian',
        false,
        null,
        true
      );
      expect(res.valid).toBeFalsy();
      expect(res.msg).toBe('Invalid value, expected to match a regex: bar');
    });

    test('should be valid when required and matching item in a list', () => {
      const res = lookupKeyValidations(
        {
          required: true,
          validatorType: 'list',
          validatorRule: 'foo, bar, baz, moo',
        },
        'baz',
        false,
        null,
        true
      );
      expect(res.valid).toBeTruthy();
    });

    test('should not be valid when required and not matching item in a list', () => {
      const list = 'foo, bar, baz, moo';
      const res = lookupKeyValidations(
        { required: true, validatorType: 'list', validatorRule: list },
        'cat',
        false,
        null,
        true
      );
      expect(res.valid).toBeFalsy();
      expect(res.msg).toBe(`Invalid value, expected one of: ${list}`);
    });

    test('should be valid when value is empty for optional param', () => {
      const res = lookupKeyValidations({}, '', false, null, true);
      expect(res.valid).toBeTruthy();
      expect(res.icon).toBe('warning-triangle-o');
    });
  });
});
