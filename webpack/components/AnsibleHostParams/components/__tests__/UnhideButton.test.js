import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import UnhideButton from '../UnhideButton';

const toggleHidden = () => {};

const fixtures = {
  'should render when value is not hidden': {
    lookupKey: {
      hiddenValue: 'foo',
      id: 80,
    },
    hidden: false,
    toggleHidden,
  },
  'should render when value is hidden': {
    lookupKey: {
      hiddenValue: 'foo',
      id: 80,
    },
    hidden: false,
    toggleHidden,
  },
  'should not show when not needed': {
    lookupKey: {},
    toggleHidden,
    hidden: false,
  },
};

describe('UnhideButton', () =>
  testComponentSnapshotsWithFixtures(UnhideButton, fixtures));
