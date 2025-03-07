import React from 'react';
import PropTypes from 'prop-types';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

const SelectedStatus = ({ selectedCount, totalCount }) => (
  <div className="pf-v5-c-dual-list-selector__status">
    <span className="pf-v5-c-dual-list-selector__status-text">
      {sprintf(__('%(selectedCount)s of %(totalCount)s items selected'), {
        selectedCount,
        totalCount,
      })}
    </span>
  </div>
);

SelectedStatus.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default SelectedStatus;
