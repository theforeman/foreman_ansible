import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import KeyInfoPopover from '../KeyInfoPopover';

import { validOverrideFactory } from '../AnsibleVariableHelpers';
import {
  ellipseLookupKey,
  ellipseLookupValue,
  squareLookupKey,
  squareLookupValue,
} from '../../AnsibleHostParams.fixtures';

const fixtures = {
  'should render when value is hidden': {
    keyErrors: validOverrideFactory(),
    lookupKey: ellipseLookupKey,
    lookupValue: ellipseLookupValue,
    hidden: true,
  },
  'should render when value is not hidden': {
    keyErrors: validOverrideFactory(),
    lookupKey: squareLookupKey,
    lookupValue: squareLookupValue,
    hidden: false,
  },
};

describe('KeyInfoPopover', () =>
  testComponentSnapshotsWithFixtures(KeyInfoPopover, fixtures));
