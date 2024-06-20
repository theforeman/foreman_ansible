import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  Form,
  FormGroup,
  Select,
  SelectVariant,
  SelectOption,
  Popover,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

export const SmartProxySelector = props => {
  const [isSmartProxyDropdownOpen, setIsSmartProxyDropdownOpen] = useState(
    false
  );
  const [isValidSmartProxy, setIsValidSmartProxy] = useState('default');

  /**
   * To be called when a SmartProxy should be selected.
   * Called by: 'SmartProxies'-field
   * Updates the smartProxySelection-state with the new selection.
   * Note: Currently only one SmartProxy may be selected. Still, an array
   * is used to allow the selection of multiple SmartProxies in the future.
   */
  const handleSmartProxySelect = useCallback(
    async (_event, value) => {
      /**
       * Method to query which roles are installed on a given SmartProxy.
       * Called by: smartProxySelection-Effect
       * Sends a request to the server, which responds with an array of roles that are installed on the provided proxy.
       * @param proxyId SmartProxy from which the roles should be queried.
       */
      const getInstalledRolesAtProxy = async proxyId => {
        const response = await fetch(`/api/v2/smart_proxies/${proxyId}/roles`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const responseJson = await response.json();
          const installedRolesMap = new Map();
          responseJson.forEach(key => installedRolesMap.set(key, null));
          const temp = props.installedRoles;
          temp[proxyId] = installedRolesMap;
          props.setInstalledRoles(temp);
        }
      };

      let updatedSmartProxySelection;
      if (props.smartProxySelection.includes(value)) {
        updatedSmartProxySelection = [];
      } else {
        updatedSmartProxySelection = [value];
        await getInstalledRolesAtProxy(props.smartProxies[value]);
      }

      props.setSmartProxySelection(updatedSmartProxySelection);
    },
    [props]
  );

  useEffect(() => {
    if (props.smartProxySelection.length !== 0) {
      setIsValidSmartProxy('success');
    } else {
      setIsValidSmartProxy('error');
    }
  }, [props.smartProxySelection]);

  /**
   * Dynamically creates the child-elements of the 'SmartProxies'-Field.
   * Called by: Render of 'SmartProxies' FormGroup.
   * @returns {*[]} Array of <SelectOption> values.
   */
  function createSmartProxySelectItems() {
    const smartProxyArray = [];
    let proxy0;
    // eslint-disable-next-line no-unused-vars
    for (const proxy of Object.keys(props.smartProxies)) {
      if (!proxy0) {
        proxy0 = proxy;
      }
      smartProxyArray.push(<SelectOption key={proxy} value={proxy} />);
    }
    if (
      smartProxyArray.length === 1 &&
      props.smartProxySelection.length === 0
    ) {
      props.setSmartProxySelection([proxy0]);
    }
    return smartProxyArray;
  }
  return (
    <Form>
      <FormGroup
        label={__('Smart Proxy')}
        labelIcon={
          <Popover
            headerContent={
              <div>
                {__(
                  'Foreman will clone your role to the selected Smart Proxy.'
                )}
              </div>
            }
          >
            <button
              type="button"
              aria-label="More info for the smart proxy selector"
              onClick={e => e.preventDefault()}
              aria-describedby="simple-form-name-01"
              className="pf-c-form__group-label-help"
            >
              <HelpIcon noVerticalAlign />
            </button>
          </Popover>
        }
        isRequired
        validated={isValidSmartProxy}
        helperTextInvalid="Smart Proxy required"
      >
        <Select
          variant={SelectVariant.single} // change to typeaheadMulti to allow selection of multiple Smart Proxies
          onToggle={() =>
            setIsSmartProxyDropdownOpen(!isSmartProxyDropdownOpen)
          }
          onSelect={handleSmartProxySelect}
          selections={props.smartProxySelection}
          isOpen={isSmartProxyDropdownOpen}
          placeholderText={__('Choose Smart Proxy')}
          maxHeight={150}
          isScrollable
        >
          {createSmartProxySelectItems()}
        </Select>
      </FormGroup>
    </Form>
  );
};

SmartProxySelector.propTypes = {
  smartProxies: PropTypes.object,
  smartProxySelection: PropTypes.array,
  setSmartProxySelection: PropTypes.func,
  installedRoles: PropTypes.object,
  setInstalledRoles: PropTypes.func,
};

SmartProxySelector.defaultProps = {
  smartProxies: {},
  smartProxySelection: [],
  setSmartProxySelection: () => {},
  installedRoles: {},
  setInstalledRoles: () => {},
};
