import React from 'react';
import { Switch, Popover, Form, FormGroup } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import './UpdateExistingSwitch.scss';

export const UpdateExistingSwitch = props => (
  <Form>
    <FormGroup
      label="Collision handling"
      labelIcon={
        <Popover
          headerContent={
            <div>
              {__(
                'When toggled, Foreman will overwrite existing roles with the same name.'
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
        label={__('Update existing')}
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
