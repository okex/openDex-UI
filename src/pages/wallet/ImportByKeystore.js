import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { UploadField } from '@navjobs/upload';
import { toLocale } from '_src/locale/react-locale';
import { crypto } from '@okchain/javascript-sdk';
import { Button } from '_component/Button';
import Icon from '_src/component/IconLite';
import Input from '_component/Input';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import ValidateCheckbox from '_component/ValidateCheckbox';
import PageURL from '_constants/PageURL';
// import util from '_src/utils/util';
import walletUtil from './walletUtil';
import './ImportByKeystore.less';

const fileStatusEnum = { // 文件导入状态
  todo: 'todo', // 待导入
  doing: 'doing', // 导入中
  retry: 'retry', // 内容非法
  done: 'done', // 已完成
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
      fileStatus: fileStatusEnum.todo, // 文件导入状态
      fileName: '', // keystore文件名
      fileError: '', // 文件错误提示
      password: '', // 密码
      pwdError: '', // 密码错误
      buttonLoading: false
    };
    this.keyStore = null;
  }
  handleUpload = (files) => {
    const file = files[0];
    if (file.type !== 'text/plain') {
      this.setState({
        fileError: toLocale('wallet_import_fileError')
      });
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    const total = file.size;
    fileReader.onprogress = (e) => {
      // util.throttle(() => {
      const progress = (e.loaded / total).toFixed(2);
      if (Number(progress) !== 1) {
        this.setState({
          fileStatus: progress,
          fileError: '',
        });
      } else {
        try {
          this.keyStore = JSON.parse(e.target.result);
          // const errArr = crypto.checkKeyStore(this.keyStore);
          // if (errArr && errArr.length) {
          //   throw (new Error(errArr[0]));
          // }
          // setTimeout(() => {
          this.setState({
            fileStatus: fileStatusEnum.done,
            fileError: '',
            fileName: file.name
          });
          // }, 0);
        } catch (err) {
          this.setState({
            fileStatus: fileStatusEnum.retry,
            fileError: toLocale('wallet_import_fileError'),
          });
        }
      }
      // });
    };
    // fileReader.onload = (e) => {

    // };
  };
  changePwd = (e) => {
    const password = e.target.value;
    this.setState({
      password,
      pwdError: ''
    });
  };
  handleEnsure = () => {
    const { fileStatus, fileError } = this.state;
    // 文件未上传 或者 文件格式错误
    if (fileStatus !== fileStatusEnum.done || fileError) {
      this.setState({
        fileError: toLocale('wallet_import_noFile'),
        buttonLoading: false
      });
      return;
    }
    this.setState({
      buttonLoading: true
    }, () => {
      setTimeout(this.validateKeyStore, 10);
    });
  };
  // 校验keystore
  validateKeyStore = () => {
    try {
      const { keyStore } = this;
      const { password } = this.state;
      const privateKey = crypto.getPrivateKeyFromKeyStore(keyStore, password);
      walletUtil.setUserInSessionStroage(privateKey, keyStore);
      this.setState({
        buttonLoading: false
      });
      // this.props.walletAction.updatePrivate(privateKey);
      this.props.commonAction.setPrivateKey(privateKey);
      this.props.history.push(PageURL.spotFullPage);
    } catch (e) {
      this.setState({
        pwdError: toLocale('wallet_import_passwordError'),
        buttonLoading: false
      });
    }
  }
  renderUploadIcon = () => {
    const { fileStatus, fileName } = this.state;
    const iconStyle = { width: 34, height: 34 };
    let dom = null;
    switch (fileStatus) {
      case fileStatusEnum.todo:
        dom = (
          <div>
            <Icon className="icon-txtx" isColor style={iconStyle} />
            <div className="icon-desc">{toLocale('wallet_import_upload_todo')}</div>
          </div>
        );
        break;
      case fileStatusEnum.retry:
        dom = (
          <div>
            <Icon className="icon-txtCopyx" isColor style={iconStyle} />
            <div className="icon-desc">{toLocale('wallet_import_upload_retry')}</div>
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
            <div className="file-progress" style={{ width: `${fileStatus * 100}%` }} />
            <Icon className="icon-txtx" isColor style={iconStyle} />
            <div className="icon-desc">{toLocale('wallet_import_upload_doing')}</div>
          </div>
        );
        break;
    }
    return dom;
  }
  clearPwdInput = () => {
    this.setState({
      password: ''
    });
  }
  render() {
    const {
      fileError, password, pwdError, buttonLoading
    } = this.state;
    return (
      <div className="import-by-keystore-container">
        <UploadField
          onFiles={this.handleUpload}
          containerProps={{ className: 'keystore-upload' }}
          uploadProps={{ accept: '.txt' }}
        >
          {this.renderUploadIcon()}
        </UploadField>

        <div className="file-error">
          {fileError}
        </div>
        <div className="password-container">
          <span>
            <Input
              value={password}
              placeholder={toLocale('wallet_import_enterPassword')}
              onChange={this.changePwd}
              onPaste={(e) => { e.preventDefault(); }}
              error={pwdError}
              theme="dark"
              allowClear
              // suffix={
              //   () => {
              //     return <Icon className="icon-close-circle" onClick={this.clearPwdInput} />;
              //   }
              // }
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
      </div >
    );
  }
}

export default ImportByKeystore;
