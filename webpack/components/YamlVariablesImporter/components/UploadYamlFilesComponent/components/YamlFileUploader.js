import React from 'react';
import {
  MultipleFileUpload,
  MultipleFileUploadMain,
  MultipleFileUploadStatus,
  MultipleFileUploadStatusItem,
} from '@patternfly/react-core';
import UploadIcon from '@patternfly/react-icons/dist/esm/icons/upload-icon';
import PropTypes from 'prop-types';
import {
  fileInTree,
  showErrorToast,
  sha256,
  treeify,
  yamlToJson,
} from '../../../YamlVariablesImporterHelpers';

export const YamlFileUploader = props => {
  const removeFile = fileId => {
    props.setCurrentFiles(currentFiles =>
      currentFiles.filter(currentFile => currentFile.uuid !== fileId)
    );
    props.setTree(currentTree =>
      currentTree.filter(fileObj => fileObj.internal_id !== fileId)
    );
  };

  const handleFileDrop = async droppedFiles => {
    // eslint-disable-next-line no-unused-vars
    for (const droppedFile of droppedFiles) {
      try {
        Object.defineProperties(droppedFile, {
          hash: {
            // eslint-disable-next-line no-await-in-loop
            value: await sha256(await droppedFile.text()),
          },
          uuid: {
            value: crypto.randomUUID(),
          },
        });
      } catch (e) {
        droppedFiles.pop(droppedFile);
        showErrorToast('uploadFile', e);
      }
    }

    props.setCurrentFiles(prevFiles => [
      ...prevFiles,
      ...droppedFiles.filter(
        droppedFile =>
          !prevFiles.some(prevFile => prevFile?.hash === droppedFile?.hash)
      ),
    ]);
  };
  const handleReadSuccess = async (data, file) => {
    if (!fileInTree(props.tree, file)) {
      const converted = await yamlToJson(data.split(',')[1]);
      if (converted) {
        const node = treeify(
          converted.response,
          file.uuid,
          file.hash,
          props.defaultRole
        );
        props.tree.push(node);
      }
    }
  };

  return (
    <MultipleFileUpload
      onFileDrop={handleFileDrop}
      dropzoneProps={{
        accept: 'application/yaml',
      }}
    >
      <MultipleFileUploadMain
        titleIcon={<UploadIcon />}
        titleText="Drag and drop files here"
        infoText="Accepted file types: YAML"
      />
      <MultipleFileUploadStatus
        statusToggleText={`${
          props.currentFiles.length ? props.currentFiles.length : 0
        } ${props.currentFiles.length !== 1 ? 'files' : 'file'} added`}
      >
        {props.currentFiles.map(file => (
          <MultipleFileUploadStatusItem
            file={file}
            key={file.name}
            onClearClick={() => removeFile(file.uuid)}
            onReadSuccess={handleReadSuccess}
            data-testid="YamlFileUploaderFileItem"
          />
        ))}
      </MultipleFileUploadStatus>
    </MultipleFileUpload>
  );
};

YamlFileUploader.propTypes = {
  tree: PropTypes.array,
  setTree: PropTypes.func,
  defaultRole: PropTypes.string,
  currentFiles: PropTypes.array,
  setCurrentFiles: PropTypes.func,
};

YamlFileUploader.defaultProps = {
  tree: {},
  setTree: () => {},
  defaultRole: '',
  currentFiles: [],
  setCurrentFiles: () => {},
};
