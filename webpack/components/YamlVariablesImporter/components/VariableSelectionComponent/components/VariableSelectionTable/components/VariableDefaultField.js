import React from 'react';
import { InputGroup, TextInput, MenuToggle } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { Select, SelectOption, SelectList } from '@patternfly/react-core/next';

export const VariableDefaultField = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(props.node.type);
  const [defaultValue, setDefaultValue] = React.useState(
    JSON.stringify(props.node.default)
  );

  const handleDefaultChange = (input, _event) => {
    setDefaultValue(input);
    props.node.default = input;
  };
  const menuRef = React.useRef(null);
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event, itemId) => {
    setSelected(itemId);
    setIsOpen(false);
    props.node.type = itemId;
  };

  return (
    <React.Fragment>
      <InputGroup>
        <Select
          id="single-select"
          ref={menuRef}
          isOpen={isOpen}
          selected={selected}
          onSelect={onSelect}
          onOpenChange={open => setIsOpen(open)}
          toggle={toggleRef => (
            <MenuToggle
              ref={toggleRef}
              onClick={onToggleClick}
              isExpanded={isOpen}
              data-testid="VariableDefaultFieldToggle"
            >
              {selected !== 'yaml' && selected !== 'json'
                ? selected.charAt(0).toUpperCase() + selected.slice(1)
                : selected.toUpperCase()}
            </MenuToggle>
          )}
        >
          <SelectList>
            <SelectOption itemId="auto">Auto</SelectOption>
            <SelectOption itemId="string">String</SelectOption>
            <SelectOption itemId="boolean">Boolean</SelectOption>
            <SelectOption itemId="integer">Integer</SelectOption>
            <SelectOption itemId="real">Real</SelectOption>
            <SelectOption itemId="array">Array</SelectOption>
            <SelectOption itemId="hash">Hash</SelectOption>
            <SelectOption itemId="yaml">YAML</SelectOption>
            <SelectOption itemId="json">JSON</SelectOption>
          </SelectList>
        </Select>
        <TextInput
          value={defaultValue}
          onChange={handleDefaultChange}
          aria-label="variable-name-input"
        />
      </InputGroup>
    </React.Fragment>
  );
};

VariableDefaultField.propTypes = {
  node: PropTypes.object,
};

VariableDefaultField.defaultProps = {
  node: {},
};
