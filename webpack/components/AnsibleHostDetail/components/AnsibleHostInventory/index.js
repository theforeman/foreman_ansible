import React, { useMemo } from 'react';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import Skeleton from 'react-loading-skeleton';
import { STATUS } from 'foremanReact/constants';

import PropTypes from 'prop-types';
import AnsibleHostInventory from './AnsibleHostInventory';
import ErrorState from '../../../ErrorState';

const WrappedAnsibleHostInventory = ({ hostId }) => {
  const params = useMemo(
    () => ({ params: { host_ids: [hostId], redact_secrets: true } }),
    [hostId]
  );

  const url = hostId && foremanUrl('/ansible/api/ansible_inventories/hosts');
  const { response: inventory, status } = useAPI('get', url, params);

  if (status === STATUS.PENDING) {
    return <Skeleton count={5} />;
  }

  if (status === STATUS.ERROR) {
    return (
      <ErrorState description={inventory?.response?.data?.error?.message} />
    );
  }

  return <AnsibleHostInventory inventoryData={inventory} />;
};

WrappedAnsibleHostInventory.propTypes = {
  hostId: PropTypes.number,
};

WrappedAnsibleHostInventory.defaultProps = {
  hostId: undefined,
};

export default WrappedAnsibleHostInventory;
