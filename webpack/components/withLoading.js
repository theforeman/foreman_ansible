import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import EmptyState from 'foremanReact/components/common/EmptyState/EmptyStatePattern';
import { LockIcon } from '@patternfly/react-icons';
import { EmptyStateIcon } from '@patternfly/react-core';
import {
  permissionCheck,
  permissionDeniedMsg,
  allowPrimaryAction,
} from '../permissionsHelper';
import ErrorState from './ErrorState';

const getResultsLength = (data, path) => {
  const split = path.split('.');
  return split.reduce(
    (prevValue, currentValue) => prevValue + data[currentValue]?.length || 0,
    0
  );
};

const withLoading = Component => {
  const defaultEmptyStateProps = {
    header: __('Nothing Found!'),
    description: '',
  };

  const Subcomponent = ({
    fetchFn,
    renameData,
    renamedDataPath,
    showEmptyState,
    emptyWrapper,
    loadingWrapper,
    wrapper,
    emptyStateProps,
    permissions,
    allowed,
    requiredPermissions,
    primaryActionPermissions,
    ...rest
  }) => {
    const { loading, error, data } = fetchFn(rest);

    if (loading) {
      return loadingWrapper(<Skeleton count={5} />);
    }

    if (error) {
      return emptyWrapper(<ErrorState description={error.message} />);
    }

    const check = permissionCheck(data.currentUser, permissions);

    if (!check.allowed) {
      return emptyWrapper(
        <EmptyState
          icon={<EmptyStateIcon icon={LockIcon} />}
          header={__('Permission denied')}
          description={permissionDeniedMsg(
            check.permissions.map(item => item.name)
          )}
        />
      );
    }

    if (!allowed) {
      return emptyWrapper(
        <EmptyState
          icon={<EmptyStateIcon icon={LockIcon} />}
          header={__('Permission denied')}
          description={permissionDeniedMsg(requiredPermissions)}
        />
      );
    }

    const renamedData = renameData(data);
    const resultLength = getResultsLength(renamedData, renamedDataPath);

    if (showEmptyState && !resultLength) {
      return emptyWrapper(
        <EmptyState
          {...{
            ...defaultEmptyStateProps,
            ...allowPrimaryAction(
              emptyStateProps,
              data.currentUser,
              primaryActionPermissions
            ),
          }}
        />
      );
    }

    return wrapper(<Component {...rest} {...renamedData} />);
  };

  Subcomponent.propTypes = {
    fetchFn: PropTypes.func.isRequired,
    renamedDataPath: PropTypes.string.isRequired,
    renameData: PropTypes.func,
    showEmptyState: PropTypes.bool,
    loadingWrapper: PropTypes.func,
    emptyWrapper: PropTypes.func,
    emptyStateProps: PropTypes.object,
    wrapper: PropTypes.func,
    permissions: PropTypes.array,
    allowed: PropTypes.bool,
    primaryActionPermissions: PropTypes.array,
  };

  Subcomponent.defaultProps = {
    renameData: data => data,
    showEmptyState: true,
    loadingWrapper: child => child,
    emptyWrapper: child => child,
    wrapper: child => child,
    emptyStateProps: defaultEmptyStateProps,
    permissions: [],
    requiredPermissions: [],
    primaryActionPermissions: [],
    allowed: true,
  };

  return Subcomponent;
};

export default withLoading;
