import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';

import Skeleton from 'react-loading-skeleton';
import EmptyState from 'foremanReact/components/common/EmptyState/EmptyStatePattern';

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
    resultPath,
    renameData,
    showEmptyState,
    emptyWrapper,
    loadingWrapper,
    wrapper,
    emptyStateProps,
    ...rest
  }) => {
    const { loading, error, data } = fetchFn(rest);

    if (loading) {
      return loadingWrapper(<Skeleton count={5} />);
    }

    if (error) {
      return emptyWrapper(<div>{error.message}</div>);
    }

    const result = pluckData(data, resultPath);
    if (
      showEmptyState &&
      ((Array.isArray(result) && result.length === 0) || !result)
    ) {
      return emptyWrapper(
        <EmptyState {...{ ...defaultEmptyStateProps, ...emptyStateProps }} />
      );
    }

    return wrapper(<Component {...rest} {...renameData(data)} />);
  };

  Subcomponent.propTypes = {
    fetchFn: PropTypes.func.isRequired,
    resultPath: PropTypes.string.isRequired,
    renameData: PropTypes.func,
    showEmptyState: PropTypes.bool,
    loadingWrapper: PropTypes.func,
    emptyWrapper: PropTypes.func,
    emptyStateProps: PropTypes.object,
  };

  Subcomponent.defaultProps = {
    renameData: data => data,
    showEmptyState: true,
    loadingWrapper: child => child,
    emptyWrapper: child => child,
    wrapper: child => child,
    emptyStateProps: defaultEmptyStateProps,
  };

  return Subcomponent;
};

export default withLoading;
