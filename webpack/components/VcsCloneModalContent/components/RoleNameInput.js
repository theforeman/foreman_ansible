import React from 'react';
import { Form, FormGroup, TextInput, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

export const RoleNameInput = props => (
  <Form>
    <FormGroup
      label={__('Role name')}
      labelIcon={
        <Popover headerContent={<div>The name for your new role.</div>}>
          <button
            type="button"
            aria-label="More info for name field"
            onClick={e => e.preventDefault()}
            aria-describedby="simple-form-name-01"
            className="pf-c-form__group-label-help"
          >
            <HelpIcon noVerticalAlign />
          </button>
        </Popover>
      }
      isRequired
    >
      <TextInput
        id="repo_name_input"
        value={props.repoName}
        onChange={value => props.setRepoName(value)}
      />
    </FormGroup>
  </Form>
);

RoleNameInput.propTypes = {
  repoName: PropTypes.string,
  setRepoName: PropTypes.func,
};

RoleNameInput.defaultProps = {
  repoName: '',
  setRepoName: () => {},
};
