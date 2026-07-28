import React from 'react';
import PropTypes from 'prop-types';
import OrderableDualListSelector from 'foremanReact/components/common/OrderableDualListSelector/OrderableDualListSelector';
import { translate as __ } from 'foremanReact/common/I18n';

const DualList = ({
  availableOptions,
  chosenOptions,
  onListChange,
  id,
  availableOptionsTitle,
  chosenOptionsTitle,
  isDisabled,
  showTooltips,
}) => (
  <OrderableDualListSelector
    id={id}
    availableOptions={availableOptions}
    chosenOptions={chosenOptions}
    onListChange={onListChange}
    availableOptionsTitle={availableOptionsTitle}
    chosenOptionsTitle={chosenOptionsTitle}
    isDisabled={isDisabled}
    showTooltips={showTooltips}
  />
);

DualList.propTypes = {
  onListChange: PropTypes.func.isRequired,
  chosenOptions: PropTypes.array.isRequired,
  availableOptions: PropTypes.array.isRequired,
  id: PropTypes.string,
  availableOptionsTitle: PropTypes.string,
  chosenOptionsTitle: PropTypes.string,
  isDisabled: PropTypes.bool,
  showTooltips: PropTypes.bool,
};

DualList.defaultProps = {
  id: 'ansible-roles-dual-list',
  availableOptionsTitle: __('Available Ansible roles'),
  chosenOptionsTitle: __('Assigned Ansible roles'),
  isDisabled: false,
  showTooltips: true,
};

export default DualList;
