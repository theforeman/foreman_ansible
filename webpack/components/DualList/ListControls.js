import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

const ListControls = props => (
  <div className="pf-v5-c-dual-list-selector__controls">
    <div className="pf-v5-c-dual-list-selector__controls-item">
      <button
        className="pf-v5-c-button pf-m-plain"
        type="button"
        disabled={props.addSelectedDisabled}
        onClick={props.onAddSelected}
        aria-label={__('Add selected')}
      >
        <i className="fas fa-fw fa-angle-right" />
      </button>
    </div>
    <div className="pf-v5-c-dual-list-selector__controls-item">
      <button
        className="pf-v5-c-button pf-m-plain"
        type="button"
        disabled={props.addAllDisabled}
        onClick={props.onAddAll}
        aria-label={__('Add all')}
      >
        <i className="fas fa-fw fa-angle-double-right" />
      </button>
    </div>
    <div className="pf-v5-c-dual-list-selector__controls-item">
      <button
        className="pf-v5-c-button pf-m-plain"
        type="button"
        disabled={props.removeAllDisabled}
        onClick={props.onRemoveAll}
        aria-label={__('Remove all')}
      >
        <i className="fas fa-fw fa-angle-double-left" />
      </button>
    </div>
    <div className="pf-v5-c-dual-list-selector__controls-item">
      <button
        className="pf-v5-c-button pf-m-plain"
        type="button"
        disabled={props.removeSelectedDisabled}
        onClick={props.onRemoveSelected}
        aria-label={__('Remove selected')}
      >
        <i className="fas fa-fw fa-angle-left" />
      </button>
    </div>
  </div>
);

ListControls.propTypes = {
  addSelectedDisabled: PropTypes.bool.isRequired,
  onAddSelected: PropTypes.func.isRequired,
  addAllDisabled: PropTypes.bool.isRequired,
  onAddAll: PropTypes.func.isRequired,
  removeAllDisabled: PropTypes.bool.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  removeSelectedDisabled: PropTypes.bool.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
};

export default ListControls;
