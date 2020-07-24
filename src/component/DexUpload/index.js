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
    const {
      onUpload
    } = this.props;
    const filePath = e.target.files[0].path;
    onUpload && onUpload(filePath);
  }

  handleUpload = () => {
    this.inputFile && this.inputFile.click();
  }

  render() {
    const {
      label, value, onChange,
    } = this.props;

    return (
      <div className="dex-upload">
        <DexInput
          label={label}
          value={value}
          onChange={onChange}
        />
        <div className="dex-upload-icon-wrap" onClick={this.handleUpload}>
          <Icon className="icon-icon_path" />
        </div>
        <input
          type="file"
          onChange={this.onFileChange}
          ref={(self) => {
            this.inputFile = self;
          }}
          style={{ display: 'none' }}
        />
      </div>
    );
  }
}

export default DexUpload;
