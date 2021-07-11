import React from 'react';
import Immutable from 'seamless-immutable';
import PropTypes from 'prop-types';
import './AnsibleHostInventory.scss';
import ReportJsonViewer from '../../../ReportJsonViewer';

const AnsibleHostInventory = ({ inventoryData }) => {
  const mutableInventory =
    inventoryData && Immutable.asMutable(inventoryData, { deep: true });

  return (
    <div className="ansible-host-inventory">
      <ReportJsonViewer data={mutableInventory} />
    </div>
  );
};

AnsibleHostInventory.propTypes = {
  inventoryData: PropTypes.object.isRequired,
};

export default AnsibleHostInventory;
