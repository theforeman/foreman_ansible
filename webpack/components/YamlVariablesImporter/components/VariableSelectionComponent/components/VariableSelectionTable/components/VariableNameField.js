import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  HelperText,
  HelperTextItem,
  FormHelperText,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import {
  duplicatesInstalled,
  duplicatesLocal,
} from '../../../../../YamlVariablesImporterHelpers';
import { DuplicateStatus } from '../../../../../YamlVariablesImporterConstants';

export const VariableNameField = props => {
  const [demoVariableName, setDemoVariableName] = React.useState(
    props.node.name
  );

  const checkForDuplicates = async (name, oldName) => {
    const isInstalledDuplicate = await duplicatesInstalled(
      props.roleName,
      name
    );
    const localDuplicates = duplicatesLocal(props.allVariables, name);
    if (localDuplicates.length > 1) {
      localDuplicates.forEach(duplicate => {
        duplicate.isDuplicate = DuplicateStatus.LOCAL_DUPLICATE;
      });
      props.setTree([...props.tree]);
    } else if (isInstalledDuplicate) {
      props.node.isDuplicate = DuplicateStatus.INSTALLED_DUPLICATE;
    } else if (props.node.isDuplicate !== DuplicateStatus.NO_DUPLICATE) {
      props.node.isDuplicate = DuplicateStatus.NO_DUPLICATE;
      const oldDuplicates = await duplicatesLocal(props.allVariables, oldName);
      if (oldDuplicates.length === 1) {
        const oldIsInstalledDuplicate = await duplicatesInstalled(
          props.roleName,
          oldName
        );
        oldDuplicates[0].isDuplicate = oldIsInstalledDuplicate
          ? DuplicateStatus.INSTALLED_DUPLICATE
          : DuplicateStatus.NO_DUPLICATE;
      }
    }
    props.setTree([...props.tree]);
  };

  const handleVariableNameChange = async (input, _event) => {
    const oldName = props.node.name;
    props.node.name = input;
    await checkForDuplicates(input, oldName);
    setDemoVariableName(input);
  };
  return (
    <Form>
      <FormGroup>
        <TextInput
          value={demoVariableName}
          onChange={handleVariableNameChange}
          aria-label="variable-name-input"
          validated={
            props.node.isDuplicate !== DuplicateStatus.NO_DUPLICATE
              ? 'error'
              : 'success'
          }
        />
        {props.node.isDuplicate !== DuplicateStatus.NO_DUPLICATE && (
          <FormHelperText component="div" isHidden={false}>
            <HelperText>
              <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                {props.node.isDuplicate === DuplicateStatus.INSTALLED_DUPLICATE
                  ? `Variable "${props.node.name}" already exists. It will be overridden!`
                  : 'Variable names must be unique.'}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </FormGroup>
    </Form>
  );
};

VariableNameField.propTypes = {
  node: PropTypes.object,
  roleName: PropTypes.string,
  allVariables: PropTypes.array,
  tree: PropTypes.array,
  setTree: PropTypes.func,
};

VariableNameField.defaultProps = {
  node: {},
  roleName: '',
  allVariables: [],
  tree: [],
  setTree: () => {},
};
