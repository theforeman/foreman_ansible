import React from 'react';
import PropTypes from 'prop-types';
import { YamlFileUploader } from './components/YamlFileUploader';

export const UploadYamlFilesComponent = props => (
  <YamlFileUploader
    tree={props.tree}
    setTree={props.setTree}
    defaultRole={props.defaultRole}
    currentFiles={props.currentFiles}
    setCurrentFiles={props.setCurrentFiles}
  />
);

UploadYamlFilesComponent.propTypes = {
  defaultRole: PropTypes.string,
  tree: PropTypes.array,
  setTree: PropTypes.func,
  currentFiles: PropTypes.array,
  setCurrentFiles: PropTypes.func,
};

UploadYamlFilesComponent.defaultProps = {
  defaultRole: '',
  tree: [],
  setTree: () => {},
  currentFiles: [],
  setCurrentFiles: () => {},
};
