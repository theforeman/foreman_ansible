import React from 'react';
import PropTypes from 'prop-types';

const ListHeader = props => (
  <div className="pf-c-dual-list-selector__header">
    <div className="pf-c-dual-list-selector__title">
      <div className="pf-c-dual-list-selector__title-text">{props.title}</div>
    </div>
  </div>
);

ListHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ListHeader;
