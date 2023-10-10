import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuContent, MenuList, MenuItem } from '@patternfly/react-core';

export const MultiSelectorMenu = props => {
  const createSelectItems = () => {
    const items = [];
    const inputItems = props.repoInfo?.[props.displayData];
    if (inputItems !== undefined) {
      // eslint-disable-next-line no-unused-vars
      for (const item of Object.keys(inputItems)) {
        items.push(
          <MenuItem key={item} itemId={item}>
            {item}
          </MenuItem>
        );
      }
    }
    return items;
  };

  return (
    <Menu
      role="listbox"
      onSelect={(_event, item) => props.setGitRef(item)}
      selected={props.gitRef}
      isScrollable
    >
      <MenuContent maxMenuHeight="175px">
        <MenuList
          data-testid="MultiSelectorMenuMenuContent"
          aria-label="MultiSelectorMenu"
        >
          {createSelectItems()}
        </MenuList>
      </MenuContent>
    </Menu>
  );
};

MultiSelectorMenu.propTypes = {
  repoInfo: PropTypes.object,
  displayData: PropTypes.string,
  setGitRef: PropTypes.func,
  gitRef: PropTypes.string,
};

MultiSelectorMenu.defaultProps = {
  repoInfo: {},
  displayData: 'branches',
  setGitRef: () => {},
  gitRef: '',
};
