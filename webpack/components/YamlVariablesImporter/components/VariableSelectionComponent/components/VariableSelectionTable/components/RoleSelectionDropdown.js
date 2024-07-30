import React, { useEffect } from 'react';
import { Select, SelectOption, SelectList } from '@patternfly/react-core/next';
import { MenuToggle } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import {
  duplicatesInstalled,
  duplicatesLocal,
} from '../../../../../YamlVariablesImporterHelpers';
import { DuplicateStatus } from '../../../../../YamlVariablesImporterConstants';

export const RoleSelectionDropdown = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(props.node.assign_to);
  const menuRef = React.useRef(null);
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const checkAllVariables = async (roleName = selected) => {
    // eslint-disable-next-line no-unused-vars
    for (const variable of props.node.variables) {
      // eslint-disable-next-line no-await-in-loop
      const isInstalledDuplicate = await duplicatesInstalled(
        roleName,
        variable.name
      );
      const localDuplicates = duplicatesLocal(
        props.node.variables,
        variable.name
      );
      if (localDuplicates.length > 1) {
        localDuplicates.forEach(duplicate => {
          duplicate.isDuplicate = DuplicateStatus.LOCAL_DUPLICATE;
        });
      } else if (isInstalledDuplicate) {
        variable.isDuplicate = DuplicateStatus.INSTALLED_DUPLICATE;
      } else {
        variable.isDuplicate = DuplicateStatus.NO_DUPLICATE;
      }
    }
  };

  useEffect(() => {
    async function request() {
      // eslint-disable-next-line no-unused-vars
      await checkAllVariables();
    }
    // eslint-disable-next-line no-unused-vars
    const ignored = request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = async (_event, itemId) => {
    await checkAllVariables(itemId);

    props.node.assign_to = itemId;
    setSelected(itemId);
    setIsOpen(false);
    props.setTree([...props.tree]);
  };
  const toggle = toggleRef => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={{
        width: '200px',
      }}
      data-testid="RoleSelectionDropdownToggle"
    >
      {selected}
    </MenuToggle>
  );
  return (
    <Select
      id="single-select"
      ref={menuRef}
      isOpen={isOpen}
      selected={selected}
      onSelect={onSelect}
      onOpenChange={open => setIsOpen(open)}
      toggle={toggle}
      isScrollable
    >
      <SelectList>
        {props.installedRoles.map(role => (
          <SelectOption key={role} itemId={role}>
            {role}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

RoleSelectionDropdown.propTypes = {
  installedRoles: PropTypes.array,
  node: PropTypes.object,
  tree: PropTypes.array,
  setTree: PropTypes.func,
};

RoleSelectionDropdown.defaultProps = {
  installedRoles: [],
  node: { variables: [] },
  tree: [],
  setTree: () => {},
};
