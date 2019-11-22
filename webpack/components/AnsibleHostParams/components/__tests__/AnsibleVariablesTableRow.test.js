import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleVariablesTableRow from '../AnsibleVariablesTableRow';

import {
  roles,
  rectangleLookupKey,
  squareLookupKey,
} from '../../AnsibleHostParams.fixtures';

const formObject = {
  resourceName: 'hostgroup',
  resourceId: null,
  parentId: null,
};

const fixtures = {
  'should render first row with a lookup key': {
    role: roles[0],
    formObject,
    firstKey: rectangleLookupKey,
    resourceError: null,
    lookupKey: rectangleLookupKey,
  },
  'should render second row with a lookup key': {
    role: roles[0],
    formObject,
    firstKey: rectangleLookupKey,
    resourceError: null,
    lookupKey: squareLookupKey,
  },
};

describe('AnsibleVariablesTableRow', () =>
  testComponentSnapshotsWithFixtures(AnsibleVariablesTableRow, fixtures));
