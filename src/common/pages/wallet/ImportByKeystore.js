import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { UploadField } from '@navjobs/upload';
import { toLocale } from '_src/locale/react-locale';
import { crypto } from '@okexchain/javascript-sdk';
import { Button } from '_component/Button';
import Icon from '_src/component/IconLite';
import Input from '_component/Input';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import ValidateCheckbox from '_component/ValidateCheckbox';
import walletUtil from './walletUtil';
import util from '_src/utils/util';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import './ImportByKeystore.less';

const fileStatusEnum = {
  todo: 'todo',
  doing: 'doing',
  retry: 'retry',
  done: 'done',
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(commonActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class ImportByKeystore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileStatus: fileStatusEnum.todo,
      fileName: '',
      fileError: '',
      password: '',
      pwdError: '',
      buttonLoading: false,
    };
    this.keyStore = null;
  }
  handleUpload = (files) => {
    const file = files[0];
    if (file.type !== 'text/plain') {
      this.setState({
        fileError: toLocale('wallet_import_fileError'),
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    const total = file.size;
    fileReader.onprogress = (e) => {
      const progress = (e.loaded / total).toFixed(2);
      if (Number(progress) !== 1) {
        this.setState({
          fileStatus: progress,
          fileError: '',
        });
      } else {
        try {
          this.keyStore = JSON.parse(e.target.result);
          this.setState({
            fileStatus: fileStatusEnum.done,
            fileError: '',
            fileName: file.name,
          });
        } catch (err) {
          this.setState({
            fileStatus: fileStatusEnum.retry,
            fileError: toLocale('wallet_import_fileError'),
          });
        }
      }
    };
  };
  changePwd = (e) => {
    const password = e.target.value;
    this.setState({
      password,
      pwdError: '',
    });
  };
  handleEnsure = () => {
    const { fileStatus, fileError } = this.state;
    if (fileStatus !== fileStatusEnum.done || fileError) {
      this.setState({
        fileError: toLocale('wallet_import_noFile'),
        buttonLoading: false,
      });
      return;
    }
    this.setState(
      {
        buttonLoading: true,
      },
      () => {
        setTimeout(this.validateKeyStore, 10);
      }
    );
  };
  validateKeyStore = () => {
    try {
      const { keyStore } = this;
      const { password } = this.state;
      const privateKey = crypto.getPrivateKeyFromKeyStore(keyStore, password);
      walletUtil.setUserInSessionStroage(privateKey, keyStore);
      this.setState({
        buttonLoading: false,
      });
      this.props.commonAction.setPrivateKey(privateKey);
      util.go(DesktopTypeMenu.current ? DesktopTypeMenu.current.url : void 0);
    } catch (e) {
      this.setState({
        pwdError: toLocale('wallet_import_passwordError'),
        buttonLoading: false,
      });
    }
  };
  renderUploadIcon = () => {
    const { fileStatus, fileName } = this.state;
    const iconStyle = { width: 34, height: 34 };
    let dom = null;
    switch (fileStatus) {
      case fileStatusEnum.todo:
        dom = (
          <div>
            <Icon className="icon-txtx" isColor style={iconStyle} />
            <div className="icon-desc">
              {toLocale('wallet_import_upload_todo')}
            </div>
          </div>
        );
        break;
      case fileStatusEnum.retry:
        dom = (
          <div>
            <Icon className="icon-txtCopyx" isColor style={iconStyle} />
            <div className="icon-desc">
              {toLocale('wallet_import_upload_retry')}
            </div>
          </div>
        );
        break;
      case fileStatusEnum.done:
        dom = (
          <div>
            <Icon className="icon-txtx" isColor style={iconStyle} />
            <div className="icon-desc">{fileName}</div>
          </div>
        );
        break;
      default:
        dom = (
          <div>
            <div
              className="file-progress"
              style={{ width: `${fileStatus * 100}%` }}
            />
            <Icon className="icon-txtx" isColor style={iconStyle} />
            <div className="icon-desc">
              {toLocale('wallet_import_upload_doing')}
            </div>
          </div>
        );
        break;
    }
    return dom;
  };
  clearPwdInput = () => {
    this.setState({
      password: '',
    });
  };
  render() {
    const { fileError, password, pwdError, buttonLoading } = this.state;
    return (
      <div className="import-by-keystore-container">
        <UploadField
          onFiles={this.handleUpload}
          containerProps={{ className: 'keystore-upload' }}
          uploadProps={{ accept: '.txt' }}
        >
          {this.renderUploadIcon()}
        </UploadField>

        <div className="file-error">{fileError}</div>
        <div className="password-container">
          <span>
            <Input
              value={password}
              placeholder={toLocale('wallet_import_enterPassword')}
              onChange={this.changePwd}
              onPaste={(e) => {
                e.preventDefault();
              }}
              error={pwdError}
              theme="dark"
              allowClear
            />
          </span>
          <ValidateCheckbox type="warning" className="mar-top10">
            {toLocale('wallet_import_passwordTip')}
          </ValidateCheckbox>
        </div>
        <Button
          type="primary"
          disabled={password.trim() === ''}
          loading={buttonLoading}
          onClick={this.handleEnsure}
        >
          {toLocale('wallet_ensure')}
        </Button>
      </div>
    );
  }
}

export default ImportByKeystore;
