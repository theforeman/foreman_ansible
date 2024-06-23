import React from 'react';
import { Select, SelectOption, SelectList } from '@patternfly/react-core/next';
import {
  MenuToggle,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
  FormGroup,
  Popover,
} from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import PropTypes from 'prop-types';

export const RoleSelectionComponent = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('');
  const [selectOptions, setSelectOptions] = React.useState([]);

  const menuRef = React.useRef(null);
  const textInputRef = React.useRef();

  React.useEffect(() => {
    let newSelectOptions = props.installedRoles;
    if (filterValue) {
      newSelectOptions = props.installedRoles.filter(menuItem =>
        String(menuItem)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
      if (!newSelectOptions.length) {
        newSelectOptions = [];
      }
    }
    setSelectOptions(newSelectOptions);
  }, [filterValue, props.installedRoles]);
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };
  const onSelect = (_event, itemId) => {
    if (itemId) {
      setInputValue(itemId);
      setFilterValue(itemId);
      props.setDefaultRole(itemId);
    }
    setIsOpen(false);
  };
  const onTextInputChange = (_event, value) => {
    setInputValue(value);
    setFilterValue(value);
  };

  const createSelectItems = () => {
    if (selectOptions.length > 0) {
      return selectOptions.map(role => (
        <SelectOption key={role} itemId={role}>
          {role}
        </SelectOption>
      ));
    }
    return <SelectOption isDisabled>No results found</SelectOption>;
  };

  const toggle = toggleRef => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onClick={onToggleClick}
          onChange={onTextInputChange}
          id="typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select a role"
        />

        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              variant="plain"
              onClick={() => {
                props.setDefaultRole('');
                setInputValue('');
                setFilterValue('');
              }}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );
  return (
    <FormGroup
      label="Ansible role:"
      isRequired
      labelIcon={
        <Popover headerContent="Select the role to import/override variables for.">
          <button
            type="button"
            aria-label="More info for assign to"
            onClick={e => e.preventDefault()}
            aria-describedby="simple-form-name-01"
            className="pf-c-form__group-label-help"
          >
            <HelpIcon noVerticalAlign />
          </button>
        </Popover>
      }
    >
      <Select
        isScrollable
        id="typeahead-select"
        ref={menuRef}
        isOpen={isOpen}
        selected={props.defaultRole}
        onSelect={onSelect}
        onOpenChange={() => {
          setIsOpen(false);
          setFilterValue('');
        }}
        toggle={toggle}
      >
        <SelectList>{createSelectItems()}</SelectList>
      </Select>
    </FormGroup>
  );
};

RoleSelectionComponent.propTypes = {
  defaultRole: PropTypes.string,
  setDefaultRole: PropTypes.func,
  installedRoles: PropTypes.array,
};

RoleSelectionComponent.defaultProps = {
  defaultRole: '',
  setDefaultRole: () => {},
  installedRoles: [],
};
