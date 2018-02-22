import React from 'react';
import JSONTree from 'react-json-tree';

const theme = {
  scheme: 'foreman',
  backgroundColor: 'rgba(0, 0, 0, 255)',
  base00: 'rgba(0, 0, 0, 0)',
};

class ReportJsonViewer extends React.Component {
  render() {
    return <div className="report-json-viewer">
      <JSONTree data={this.props.data} hideRoot theme={theme} />
    </div>;
  }
}
export default ReportJsonViewer;
