import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import ListControls from './ListControls';
import ListPane from './ListPane';
import './DualList.scss';

const DualList = props => {
  const defaultSelectState = { availableSelected: [], chosenSelected: [] };
  const [selectState, setSelectState] = useState(defaultSelectState);

  const onItemClick = stateName => itemName => (...args) => {
    if (isItemSelected(stateName)(itemName)) {
      setSelectState({
        ...selectState,
        [stateName]: selectState[stateName].filter(item => item !== itemName),
      });
    } else {
      setSelectState({
        ...selectState,
        [stateName]: [...selectState[stateName], itemName],
      });
    }
  };

  const isItemSelected = stateName => item =>
    selectState[stateName].includes(item);

  const onAddAll = () =>
    props.onListChange([], [...props.chosenOptions, ...props.availableOptions]);
  const onRemoveAll = () =>
    props.onListChange([...props.availableOptions, ...props.chosenOptions], []);

  const onAddSelected = () => {
    const [newAvailable, newChosen] = moveItems(
      props.availableOptions,
      props.chosenOptions,
      selectState.availableSelected
    );
    setSelectState(defaultSelectState);
    props.onListChange(newAvailable, newChosen);
  };

  const onRemoveSelected = () => {
    const [newChosen, newAvailable] = moveItems(
      props.chosenOptions,
      props.availableOptions,
      selectState.chosenSelected
    );
    setSelectState(defaultSelectState);
    props.onListChange(newAvailable, newChosen);
  };

  const moveItems = (removeFrom, addTo, selected) => {
    const newRemoveFrom = removeFrom.filter(item => !selected.includes(item));
    return [newRemoveFrom, [...addTo, ...selected]];
  };

  const onChosenSetOrder = items =>
    props.onListChange(props.availableOptions, items);

  return (
    <div className="pf-v5-c-dual-list-selector">
      <ListPane
        title={__('Available Ansible roles')}
        items={props.availableOptions}
        paneClass="pf-m-available"
        onItemClick={onItemClick('availableSelected')}
        selected={selectState.availableSelected}
        isItemSelected={isItemSelected('availableSelected')}
      />
      <ListControls
        onAddSelected={onAddSelected}
        onRemoveSelected={onRemoveSelected}
        onRemoveAll={onRemoveAll}
        onAddAll={onAddAll}
        addAllDisabled={props.availableOptions.length === 0}
        removeAllDisabled={props.chosenOptions.length === 0}
        addSelectedDisabled={selectState.availableSelected.length === 0}
        removeSelectedDisabled={selectState.chosenSelected.length === 0}
      />
      <ListPane
        title={__('Host assigned Ansible roles')}
        items={props.chosenOptions}
        paneClass="pf-m-chosen"
        draggable
        onItemClick={onItemClick('chosenSelected')}
        selected={selectState.chosenSelected}
        isItemSelected={isItemSelected('chosenSelected')}
        onSetOrderedItems={onChosenSetOrder}
      />
    </div>
  );
};

DualList.propTypes = {
  onListChange: PropTypes.func.isRequired,
  chosenOptions: PropTypes.array.isRequired,
  availableOptions: PropTypes.array.isRequired,
};

export default DualList;
