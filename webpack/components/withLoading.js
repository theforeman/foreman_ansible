import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import EmptyState from 'foremanReact/components/common/EmptyState/EmptyStatePattern';
import { LockIcon } from '@patternfly/react-icons';
import { EmptyStateIcon } from '@patternfly/react-core';
import { permissionCheck, permissionDeniedMsg } from '../permissionsHelper';
import ErrorState from './ErrorState';

const pluckData = (data, path) => {
  const split = path.split('.');
  return split.reduce((memo, item) => {
    if (item) {
      return memo[item];
    }
    throw new Error('Unexpected empty segment in response data path');
  }, data);
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

    const renamedData = renameData(data);
    const result = pluckData(renamedData, renamedDataPath);

    if (
      showEmptyState &&
      ((Array.isArray(result) && result.length === 0) || !result)
    ) {
      return emptyWrapper(
        <EmptyState {...{ ...defaultEmptyStateProps, ...emptyStateProps }} />
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
  };

  Subcomponent.defaultProps = {
    renameData: data => data,
    showEmptyState: true,
    loadingWrapper: child => child,
    emptyWrapper: child => child,
    wrapper: child => child,
    emptyStateProps: defaultEmptyStateProps,
    permissions: [],
  };

  return Subcomponent;
};

export default withLoading;
