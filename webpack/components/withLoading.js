import React from 'react';
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
  const Subcomponent = ({
    fetchFn,
    resultPath,
    renameData,
    emptyStateTitle,
    ...rest
  }) => {
    const { loading, error, data } = fetchFn(rest);

    if (loading) {
      return <Skeleton count={5} />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    const result = pluckData(data, resultPath);

    if ((Array.isArray(result) && result.length === 0) || !result) {
      return <EmptyState header={emptyStateTitle} description="" />;
    }

    return <Component {...rest} {...renameData(data)} />;
  };

  Subcomponent.propTypes = {
    fetchFn: PropTypes.func.isRequired,
    resultPath: PropTypes.string.isRequired,
    renameData: PropTypes.func,
    emptyStateTitle: PropTypes.string.isRequired,
  };

  Subcomponent.defaultProps = {
    renameData: data => data,
  };

  return Subcomponent;
};

export default withLoading;
