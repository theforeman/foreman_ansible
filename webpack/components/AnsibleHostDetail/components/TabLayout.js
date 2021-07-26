import React from 'react';
import PropTypes from 'prop-types';

const TabLayout = props => (
  <div className="host-details-tab-item">
    <div className="ansible-host-detail">{props.children}</div>
  </div>
);

TabLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default TabLayout;
