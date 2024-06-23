import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import {
  testCopy,
  testDefaultRole,
  testNoSelectionTree,
} from '../../../testConstants';

import { YamlFileUploader } from './YamlFileUploader';

describe('YamlFileUploader', () => {
  it('should render', async () => {
    const testTree = testCopy(testNoSelectionTree);

    const { container } = render(
      <YamlFileUploader
        tree={testTree}
        defaultRole={testDefaultRole}
        currentFiles={testTree.map(
          fileNode =>
            new File([''], `${fileNode.internal_id}.yaml`, {
              type: 'text/plain',
            })
        )}
      />
    );

    const fileListings = container.querySelectorAll(
      '.pf-c-multiple-file-upload__status-item'
    );
    expect(fileListings).toHaveLength(testTree.length);
  });
});
