import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import AnsiblePermissionDenied from './AnsiblePermissionDenied';

jest.mock('foremanReact/components/common/EmptyState');

describe(
  'AnsiblePermissionDenied',
  () => testComponentSnapshotsWithFixtures(AnsiblePermissionDenied, { 'should render': {} }),
);
