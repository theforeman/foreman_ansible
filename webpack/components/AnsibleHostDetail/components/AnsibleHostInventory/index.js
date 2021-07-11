import React, { useMemo } from 'react';
import { foremanUrl } from 'foremanReact/common/helpers';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import PropTypes from 'prop-types';
import AnsibleHostInventory from './AnsibleHostInventory';

const WrappedAnsibleHostInventory = ({ hostId }) => {
  const params = useMemo(() => ({ params: { host_ids: [hostId] } }), [hostId]);

  const url = hostId && foremanUrl('/ansible/api/ansible_inventories/hosts');
  const { response: inventory } = useAPI('get', url, params);

  return <AnsibleHostInventory inventoryData={inventory} />;
};

WrappedAnsibleHostInventory.propTypes = {
  hostId: PropTypes.number,
};

WrappedAnsibleHostInventory.defaultProps = {
  hostId: undefined,
};

export default WrappedAnsibleHostInventory;
