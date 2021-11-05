import React from 'react';
import EmptyState from 'foremanReact/components/common/EmptyState/EmptyStatePattern';

import { EmptyStateIcon } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_200 as dangerColor } from '@patternfly/react-tokens';
import { translate as __ } from 'foremanReact/common/I18n';

const ErrorState = props => {
  const icon = (
    <EmptyStateIcon icon={ExclamationCircleIcon} color={dangerColor.value} />
  );
  return <EmptyState header={__('Error!')} icon={icon} {...props} />;
};

export default ErrorState;
