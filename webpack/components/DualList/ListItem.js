import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ListItem = props => {
  const draggableBtn = (
    <div className="pf-v5-c-dual-list-selector__draggable">
      <button
        className="pf-v5-c-button pf-m-plain"
        type="button"
        aria-pressed="false"
        aria-label="Reorder"
        id="draggable-list-item-2-draggable-button"
        aria-labelledby="draggable-list-item-2-draggable-button draggable-list-item-2-item-text"
        aria-describedby="draggable-help"
      >
        <i className="fas fa-grip-vertical" aria-hidden="true" />
      </button>
    </div>
  );

  const orderBtn = (
    <span className="foreman-dual-list-order">{`${props.index + 1}.`}</span>
  );

  return (
    <li className="pf-v5-c-dual-list-selector__list-item">
      <div
        className={classNames('pf-v5-c-dual-list-selector__list-item-row ', {
          'pf-m-selected': props.selected,
          'pf-m-ghost-row': props.dragging,
        })}
      >
        {props.draggable && draggableBtn}
        <button
          className="pf-v5-c-dual-list-selector__item"
          type="button"
          onClick={props.onClick}
        >
          <span className="pf-v5-c-dual-list-selector__item-main">
            <span className="pf-v5-c-dual-list-selector__item-text">
              {props.draggable && orderBtn}
              <span>{props.name}</span>
            </span>
          </span>
          <span className="pf-v5-c-dual-list-selector__item-count">
            <span className="pf-v5-c-badge pf-m-read" />
          </span>
        </button>
      </div>
    </li>
  );
};

ListItem.propTypes = {
  selected: PropTypes.bool.isRequired,
  dragging: PropTypes.bool,
  draggable: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

ListItem.defaultProps = {
  draggable: false,
  dragging: false,
};

export default ListItem;
