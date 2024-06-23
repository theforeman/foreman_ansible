import React, { useState, useCallback, useRef } from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { Wizard, WizardStep, WizardHeader } from '@patternfly/react-core/next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { VariableSelectionComponent } from './components/VariableSelectionComponent/VariableSelectionComponent';
import { UploadYamlFilesComponent } from './components/UploadYamlFilesComponent/UploadYamlFilesComponent';
import {
  evaluateTree,
  getInstalledRoles,
  installFrom,
} from './YamlVariablesImporterHelpers';
import { RoleSelectionComponent } from './components/RoleSelectionComponent';

import { CLOSE_YAML_IMPORT } from './YamlVariablesImporterConstants';

export const YamlVariablesImporter = props => {
  const dispatch = useDispatch();

  const [tree, setTree] = useState([]);

  const [defaultRole, setDefaultRole] = useState('Select default role');
  const [installedRoles, setInstalledRoles] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [startIndex, setStartIndex] = useState(1);
  const haveRolesBeenRequested = useRef(false);

  if (props.roleName) {
    // opened from roles page
    if (defaultRole !== props.roleName) {
      setDefaultRole(props.roleName);
      setInstalledRoles([props.roleName]);
      setStartIndex(2);
    }
  } else if (installedRoles.length === 0 && !haveRolesBeenRequested.current) {
    const getAndSetRoles = async () => {
      const request = await getInstalledRoles();
      if (request) {
        setInstalledRoles(request.response);
      }
    };
    // eslint-disable-next-line no-unused-vars
    const ignored = getAndSetRoles();
    haveRolesBeenRequested.current = true;
  }

  const handleWizardFinish = async () => {
    await installFrom('json', evaluateTree(tree));
  };

  const handleModalClose = useCallback(() => {
    dispatch({ type: CLOSE_YAML_IMPORT });

    setTree([]);
    setDefaultRole('Select default role');
    setInstalledRoles([]);
    setCurrentFiles([]);
    haveRolesBeenRequested.current = false;

    window.location.hash = '';
  }, [dispatch]);

  return (
    <Modal
      isOpen={props.isWizardOpen}
      showClose={false}
      hasNoBodyWrapper
      variant={ModalVariant.large}
    >
      <Wizard
        height={250}
        header={
          <WizardHeader
            title="Import Variables from YAML-Files"
            onClose={handleModalClose}
          />
        }
        onClose={handleModalClose}
        onSave={handleWizardFinish}
        startIndex={startIndex}
      >
        <WizardStep
          name="Select Role"
          id="in-modal-step-1"
          isDisabled={props.fromRole}
          footer={{
            isNextDisabled: defaultRole === 'Select default role',
          }}
        >
          <RoleSelectionComponent
            defaultRole={defaultRole}
            setDefaultRole={setDefaultRole}
            installedRoles={installedRoles}
          />
        </WizardStep>
        <WizardStep name="Upload YAML-Files" id="in-modal-step-2">
          <UploadYamlFilesComponent
            tree={tree}
            setTree={setTree}
            defaultRole={defaultRole}
            setDefaultRole={setDefaultRole}
            installedRoles={installedRoles}
            currentFiles={currentFiles}
            setCurrentFiles={setCurrentFiles}
          />
        </WizardStep>
        <WizardStep
          name="Select Variables"
          id="in-modal-review-step"
          footer={{ nextButtonText: 'Finish' }}
        >
          <VariableSelectionComponent
            tree={tree}
            setTree={setTree}
            installedRoles={installedRoles}
          />{' '}
        </WizardStep>
      </Wizard>
    </Modal>
  );
};

YamlVariablesImporter.propTypes = {
  isWizardOpen: PropTypes.bool,
  roleName: PropTypes.string,
  fromRole: PropTypes.bool,
};

YamlVariablesImporter.defaultProps = {
  isWizardOpen: false,
  roleName: null,
  fromRole: false,
};
