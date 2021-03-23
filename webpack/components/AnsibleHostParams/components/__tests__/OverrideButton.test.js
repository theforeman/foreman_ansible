import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import OverrideButton from '../OverrideButton';

const keyId = 7;

const toggleField = () => {};

const props = {
  keyId,
  toggleField,
};

const fixtures = {
  'should render when field is overriden': {
    fieldOverriden: true,
    ...props,
  },
  'should render when field is not overriden': {
    fieldOverriden: false,
    ...props,
  },
};

describe('OverrideButton', () =>
  testComponentSnapshotsWithFixtures(OverrideButton, fixtures));
