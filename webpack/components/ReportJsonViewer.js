import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';

const theme = {
  scheme: 'foreman',
  backgroundColor: 'rgba(0, 0, 0, 255)',
  base00: 'rgba(0, 0, 0, 0)',
};

const ReportJsonViewer = ({ data }) => (
  <div className="report-json-viewer">
    <JSONTree
      data={data}
      hideRoot
      theme={theme}
      shouldExpandNode={(keyPath, _myData, level) =>
        keyPath[0] === '_meta' ||
        keyPath[0] === 'hostvars' ||
        level === 3 ||
        keyPath[0] === 'foreman_ansible_roles'
      }
    />
  </div>
);

ReportJsonViewer.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ReportJsonViewer;
