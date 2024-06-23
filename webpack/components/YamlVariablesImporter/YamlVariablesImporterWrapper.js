import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { YamlVariablesImporter } from './YamlVariablesImporter';
import { OPEN_YAML_IMPORT } from './YamlVariablesImporterConstants';

export const YamlVariablesImporterWrapper = () => {
  const dispatch = useDispatch();

  const wizardState = useSelector(
    state => state.foremanAnsible.yamlVariablesReducer
  );

  /**
   * Watch URL-anchor and open/close modal.
   */
  useEffect(() => {
    // Handle direct link ...#yaml_import
    if (window.location.hash === '#yaml_import') {
      dispatch({
        type: OPEN_YAML_IMPORT,
        payload: { roleName: 'testName' },
      });
    }
    // Set event listener for anchor change
    onhashchange = () => {
      if (window.location.hash === '#yaml_import') {
        dispatch({
          type: OPEN_YAML_IMPORT,
          payload: { roleName: 'testName' },
        });
      }
    };
  }, [dispatch]);

  return (
    <YamlVariablesImporter
      setIsWizardOpen={wizardState.isModalOpen}
      isWizardOpen={wizardState.isModalOpen}
      roleName={wizardState.roleName}
      fromRole={wizardState.fromRole}
    />
  );
};
