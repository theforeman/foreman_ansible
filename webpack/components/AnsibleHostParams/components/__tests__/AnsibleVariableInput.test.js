import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleVariableInput from '../AnsibleVariableInput';

import {
  squareLookupKey,
  squareLookupValue,
} from '../../AnsibleHostParams.fixtures';

const props = {
  toggleOverride: () => {},
  updateFieldValue: () => {},
  toggleHidden: () => {},
  formModelField: 'host',
  lookupKey: squareLookupKey,
  lookupValue: squareLookupValue,
  keyErrors: {},
  fieldValue: 'foo',
  fieldHiddenValue: false,
};

const fixtures = {
  'should render': {
    fieldDisabled: false,
    fieldOverriden: false,
    hiddenValue: false,
    ...props,
  },
  'should render when disabled': {
    fieldDisabled: true,
    fieldOverriden: false,
    hiddenValue: false,
    ...props,
  },
  'should render when overriden': {
    fieldDisabled: false,
    fieldOverriden: true,
    hiddenValue: false,
    ...props,
  },
  'should render when hidden': {
    fieldDisabled: false,
    fieldOverriden: false,
    hiddenValue: true,
    ...props,
  },
};

describe('AnsibleVariableInput', () =>
  testComponentSnapshotsWithFixtures(AnsibleVariableInput, fixtures));
