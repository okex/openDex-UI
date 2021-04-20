import React, { Component } from 'react';
import DexInput from '_component/DexDesktopInput';
import Icon from '_component/IconLite';
import './index.less';

class DexUpload extends Component {
  constructor() {
    super();
    this.state = {};
  }

  onFileChange = (e) => {
    const { onUpload } = this.props;
    const filePath = e.target.files[0].path;
    onUpload && onUpload(filePath);
  };

  showOpenDialog = async (e) => {
    const { onUpload, directory } = this.props;
    const { dialog } = window.require('electron').remote;
    e.preventDefault();
    const pathType = directory ? 'directory' : 'file';
    const options = {
      properties: ['showHiddenFiles'],
    };
    if (pathType === 'directory') {
      options.properties.push('openDirectory');
    } else {
      options.properties.push('openFile');
    }
    dialog.showOpenDialog(options).then((result) => {
      const filePath = result.filePaths[0];
      onUpload && onUpload(filePath);
    });
    return null;
  };

  handleUpload = () => {
    this.inputDir && this.inputDir.click();
  };

  render() {
    const { label, value, onChange, directory } = this.props;

    return (
      <div className="dex-upload">
        <DexInput label={label} value={value} onChange={onChange} />
        <div className="dex-upload-icon-wrap" onClick={this.handleUpload}>
          <Icon className="icon-icon_path" />
        </div>
        <input
          type="file"
          onClick={this.showOpenDialog}
          ref={(self) => {
            this.inputDir = self;
          }}
          style={{ display: 'none' }}
          webkitdirectory={directory ? 1 : 0}
          directory={directory ? 1 : 0}
        />
      </div>
    );
  }
}

export default DexUpload;
