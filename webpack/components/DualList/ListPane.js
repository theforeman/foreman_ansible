import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';

import {
  orderable,
  orderDragged,
} from 'foremanReact/components/common/forms/OrderableSelect/helpers';

import ListItem from './ListItem';
import ListHeader from './ListHeader';
import SelectedStatus from './SelectedStatus';

const OrderableListItem = orderable(ListItem, {
  type: 'orderableItem',
  getItem: props => ({ id: props.name }),
  direction: 'vertical',
});

const ListPane = ({
  items,
  isItemSelected,
  draggable,
  onItemClick,
  paneClass,
  title,
  selected,
  onSetOrderedItems,
}) => {
  const moveValue = (dragIndex, hoverIndex) => {
    onSetOrderedItems(orderDragged(items, dragIndex, hoverIndex));
  };

  const renderOrderableItem = (item, idx) => (
    <OrderableListItem
      key={item}
      name={item}
      index={idx}
      moveValue={moveValue}
      onClick={onItemClick(item)}
      selected={isItemSelected(item)}
      draggable={draggable}
    />
  );

  const renderListItem = (item, idx) => (
    <ListItem
      key={item}
      name={item}
      index={idx}
      onClick={onItemClick(item)}
      selected={isItemSelected(item)}
    />
  );

  const renderItem = draggable ? renderOrderableItem : renderListItem;

  return (
    <div
      className={`pf-v5-c-dual-list-selector__pane pf-m-available ${paneClass}`}
    >
      <ListHeader title={title} />
      <SelectedStatus
        selectedCount={selected.length}
        totalCount={items.length}
      />
      <div className="pf-v5-c-dual-list-selector__menu">
        <DndProvider backend={HTML5Backend}>
          <ul className="pf-v5-c-dual-list-selector__list">
            {items.map(renderItem)}
          </ul>
        </DndProvider>
      </div>
    </div>
  );
};

ListPane.propTypes = {
  items: PropTypes.array.isRequired,
  isItemSelected: PropTypes.func.isRequired,
  draggable: PropTypes.bool,
  onItemClick: PropTypes.func.isRequired,
  paneClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  onSetOrderedItems: PropTypes.func,
};

ListPane.defaultProps = {
  draggable: false,
  onSetOrderedItems: () => {},
};

export default ListPane;
