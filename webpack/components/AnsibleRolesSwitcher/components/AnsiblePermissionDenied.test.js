import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import AnsiblePermissionDenied from './AnsiblePermissionDenied';

jest.mock('foremanReact/components/common/EmptyState');

describe('AnsiblePermissionDenied', () =>
  testComponentSnapshotsWithFixtures(AnsiblePermissionDenied, {
    'should render': {},
  }));
