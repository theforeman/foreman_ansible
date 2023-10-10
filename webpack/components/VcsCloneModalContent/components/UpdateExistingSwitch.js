import React from 'react';
import { Switch, Popover, Form, FormGroup } from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

export const UpdateExistingSwitch = props => (
  <Form>
    <FormGroup
      label="Collision handling"
      labelIcon={
        <Popover
          headerContent={
            <div>
              {__(
                'When toggled, Foreman will override already installed roles with the given name.'
              )}
            </div>
          }
        >
          <button
            type="button"
            aria-label="More info for update existing switch"
            onClick={e => e.preventDefault()}
            className="pf-c-form__group-label-help"
          >
            <HelpIcon noVerticalAlign />
          </button>
        </Popover>
      }
    >
      {' '}
      <Switch
        hasCheckIcon
        id="simple-switch"
        label={__('Updating existing')}
        labelOff={__('Skipping existing')}
        isChecked={props.updateExisting}
        onChange={value => props.setUpdateExisting(value)}
      />
    </FormGroup>
  </Form>
);

UpdateExistingSwitch.propTypes = {
  updateExisting: PropTypes.bool,
  setUpdateExisting: PropTypes.func,
};

UpdateExistingSwitch.defaultProps = {
  updateExisting: false,
  setUpdateExisting: () => {},
};
