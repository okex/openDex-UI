import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import URL from '_src/constants/URL';
import { Dialog } from '_component/Dialog';
import { Button } from '_component/Button';
import Select from '_component/ReactSelect';
import Checkbox from 'rc-checkbox';
import FormatNum from '_src/utils/FormatNum';
import { calc } from '_component/okit';
import PasswordDialog from '_component/PasswordDialog';
import util from '../../utils/util';
import ont from '../../utils/dataProxy';
import { getLpTokenStr, isLpToken } from '../../utils/lpTokenUtil';
import env from '../../constants/env';
import './AddAssetsDialog.less';
import operationContract from './operationContract.js'

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  const { valuationToken } = state.Spot;
  return { okexchainClient, valuationToken };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class AddAssetsDialog extends Component {
  // constructor(props) {
  //   super(props);
  //   this.feeToken = this.props.valuationToken;
  //   this.addrReg = /^okexchain/i;
  //   this.loadingDur = 500;
  //   this.transDur = 2500;
  //   this.initState = {
  //     step: 1,
  //     symbol: '',
  //     address: '',
  //     addressErr: false,
  //     addressErrType: 'format',
  //     amount: '',
  //     amountErr: false,
  //     note: '',
  //     noteErr: false,
  //     fee: env.envConfig.fee,
  //     feeErr: false,
  //     pwdErr: '',
  //     available: 0,
  //     processingPwd: false,
  //   };
  //   this.state = {
  //     transferring: false,
  //     ...this.initState,
  //     check: !isLpToken(props.symbol),
  //     hideCheck: !isLpToken(props.symbol),
  //   };
  //   this.feeLeft = 0;
  //   this.addr = window.OK_GLOBAL.senderAddr;
  // }
  constructor(props) {
    super(props)
    this.addrReg = /^0x/i
    this.initState = {
      address: '',
      addressErr: false,
      shortName: '',
      shortNameErr: false,
      precision: '',
      precisionErr: false
    }
    this.state = {
      ...this.initState
    }
  }
  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;
    if (show !== this.props.show && this.props.show) {
      this.setState(Object.assign(this.state, { ...this.initState }));
    }
    console.log(operationContract.get())
    // let contractList = window.localStorage.getItem(env.envConfig.contract)
  }
  canProceed = () => {
    const { address, addressErr, shortName, shortNameErr, precision, precisionErr } = this.state;
    if (addressErr || shortNameErr || precisionErr) return false
    return address && shortName && precision
  };
  onBlur = (type) => {
    return (event) => {
      const value = event.target ? event.target.value : event;
      let err = false;
      const { available, fee } = this.state;
      if (type === 'address') {
        if (value.trim() && !this.addrReg.test(value)) {
          err = true;
        }
      }
      if (type === 'shortName') {
        err = !value.trim()
      }
      if (type === 'precision') {
        err = !value.trim()
      }
      this.setState({
        [`${type}Err`]: err,
      });
    };
  };
  onChange = (type) => {
    return (e) => {
      let value = e.target ? e.target.value : e;
      this.setState({
        [type]: value,
        [`${type}Err`]: false,
      });
    };
  };
  submitAdd = () => {
    const { onClose } = this.props;
    const { address, shortName, precision } = this.state
    operationContract.add(address, shortName, precision)
    onClose()
  };

  /* fetchFeeTokenAsset = (symbol) => {
    ont
      .get(`${URL.GET_ACCOUNTS}/${this.addr}`, {
        params: { symbol: this.feeToken },
      })
      .then(({ data }) => {
        const { currencies } = data;
        const assets = currencies || [];
        if (assets.length) {
          this.feeLeft = assets[0].available;
          if (symbol === this.feeToken) {
            this.calAvaIsFeeToken();
          }
        }
      });
  };
  calAvaIsFeeToken = () => {
    const { fee } = this.state;
    if (this.feeLeft > fee) {
      this.setState({
        available: util.precisionInput(calc.sub(this.feeLeft, fee, false)).replace(/,/g,''),
      });
    } else {
      this.setState({ available: 0 });
    }
  };
  fetchAsset = (symbol) => {
    ont
      .get(`${URL.GET_ACCOUNTS}/${this.addr}`, { params: { symbol } })
      .then(({ data }) => {
        const { currencies } = data;
        const assets = currencies || [];
        if (assets.length) {
          this.setState({ available: assets[0].available });
        }
      });
  };
  
  
  allIn = () => {
    const { available } = this.state;
    this.setState({ amount: util.precisionInput(available, 8, false) });
  };
  setSymbol = (symbol, checkFee = true) => {
    this.setState({ symbol,
      check: !isLpToken(symbol),
      hideCheck: !isLpToken(symbol)
    }, () => {
      if (symbol) {
        this.setState(
          {
            available: 0,
            amount: '',
            amountErr: false,
            feeErr: false,
          },
          () => {
            if (symbol === this.feeToken) {
              if (checkFee) {
                this.calAvaIsFeeToken();
              }
            } else {
              this.fetchAsset(symbol);
            }
          }
        );
      }
    });
  };
  canProceed = () => {
    const { fee, symbol, address, amount, available,check } = this.state;
    return (
      this.props.tokenList.length &&
      symbol &&
      address.trim() &&
      this.addrReg.test(address.trim()) &&
      Number(amount) &&
      !util.compareNumber(available, amount) &&
      util.compareNumber(fee, this.feeLeft) &&
      this.addr &&
      this.addr.toLowerCase() !== address.trim().toLowerCase() &&
      check
    );
  };
  
  transfer = (pwd) => {
    if (!util.isLogined()) {
      window.location.reload();
    }

    if (this.state.processingPwd) return;
    this.setState(
      {
        processingPwd: true,
      },
      () => {
        setTimeout(() => {
          this.props.commonAction.validatePassword(
            pwd,
            (privateKey) => {
              const { onClose, onSuccess, okexchainClient } = this.props;
              const { symbol, address, amount, note, available } = this.state;
              onClose();
              this.setState({ transferring: true });
              let amountStr = util.precisionInput(amount).replace(/,/g,'');
              if (
                util.precisionInput(amount, 8) ===
                util.precisionInput(available, 8)
              ) {
                amountStr = available;
              }
              okexchainClient.setAccountInfo(privateKey).then(() => {
                okexchainClient
                  .sendSendTransaction(address, amountStr, symbol, note)
                  .then((res) => {
                    if (res.result.code) {
                      setTimeout(() => {
                        this.setState({ transferring: false });
                        const dialog = Dialog.show({
                          theme: 'dark trans-alert',
                          hideCloseBtn: true,
                          children: (
                            <div className="trans-msg">
                              <Icon className="icon-icon_fail" isColor />
                              {toLocale(`error.code.${res.result.code}`) ||
                                toLocale('trans_fail')}
                            </div>
                          ),
                        });
                        setTimeout(() => {
                          dialog.destroy();
                        }, this.transDur);
                      }, this.loadingDur);
                    } else {
                      setTimeout(() => {
                        this.setState({ transferring: false });
                        const dialog = Dialog.show({
                          theme: 'dark trans-alert',
                          hideCloseBtn: true,
                          children: (
                            <div className="trans-msg">
                              <Icon className="icon-icon_success" isColor />
                              {toLocale('trans_success')}
                            </div>
                          ),
                        });
                        setTimeout(() => {
                          dialog.destroy();
                          onSuccess();
                        }, this.transDur);
                      }, this.loadingDur);
                    }
                  })
                  .catch(() => {
                    setTimeout(() => {
                      this.setState({ transferring: false });
                      const dialog = Dialog.show({
                        theme: 'dark trans-alert',
                        hideCloseBtn: true,
                        children: (
                          <div className="trans-msg">
                            <Icon className="icon-icon_fail" isColor />
                            {toLocale('trans_fail')}
                          </div>
                        ),
                      });
                      setTimeout(() => {
                        dialog.destroy();
                      }, this.transDur);
                    }, this.loadingDur);
                  });
              });
            },
            () => {
              this.setState({
                pwdErr: toLocale('trans_err_pwd'),
                processingPwd: false,
              });
            }
          );
        }, 20);
      }
    );
  };
  toggleCheck = (e) => {
    this.setState({ check: e.target.checked });
  } */
  render() {
    const {
      address,
      shortName,
      precision,
      addressErr,
      shortNameErr,
      precisionErr,
    } = this.state;
    const { show, onClose } = this.props;
    return (
      <div className="add-assets-container">
        <Dialog
          theme="base-dialog"
          title={toLocale('add_assets')}
          openWhen={show}
          onClose={onClose}
        >
          <div className="add-assets-content">
            <table>
              <tbody>
                <tr><td className="add-assets-label">{toLocale('dex_input_label_contract')}</td></tr>
                <tr>
                <td>
                    <input
                      autoComplete="address"
                      className="assets-input address"
                      maxLength={50}
                      value={address}
                      onBlur={this.onBlur('address')}
                      onChange={this.onChange('address')}
                      placeholder={toLocale('dex_input_label_contract')}
                    />
                    {addressErr && (
                      <p className="error">
                        {toLocale('dex_input_err_tip_contract')}
                      </p>
                    )}
                  </td>
                </tr>
                <tr><td className="add-assets-label">{toLocale('dex_input_label_short_name')}</td></tr>
                <tr>
                  <td>
                    <input
                      autoComplete="address"
                      className="assets-input address"
                      maxLength={50}
                      value={shortName}
                      onBlur={this.onBlur('shortName')}
                      onChange={this.onChange('shortName')}
                      placeholder={toLocale('dex_input_label_short_name')}
                    />
                    {shortNameErr && (
                      <p className="error">
                        {toLocale('dex_input_err_tip_short_name')}
                      </p>
                    )}
                  </td>
                </tr>
                <tr><td className="add-assets-label">{toLocale('dex_input_label_precision')}</td></tr>
                <tr>
                  <td>
                    <input
                      className="assets-input amount"
                      onBlur={this.onBlur('precision')}
                      onChange={this.onChange('precision')}
                      value={precision}
                      placeholder={toLocale('dex_input_label_precision')}
                    />
                    {precisionErr && (
                      <p className="error">
                        {toLocale('dex_input_err_tip_precision')}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="add-assets-footer">
              <Button
                type={Button.btnType.default}
                style={{ background : '#2676FF' }}
                onClick={this.submitAdd}
                disabled={!this.canProceed()}
              >
                {toLocale('ensure')}
              </Button>
            </div>
        </Dialog>
        {/* <PasswordDialog
          isShow={show && [3].includes(step)}
          onClose={onClose}
          onEnter={this.transfer}
          btnLoading={processingPwd}
          updateWarning={(err) => {
            this.setState({ pwdErr: err });
          }}
          warning={pwdErr}
        /> */}
        {/* <div className={`trans-loading ${transferring ? '' : 'hide'}`}>
          <div className="loading-icon">
            <Icon className="icon-loadingCopy" isColor />
          </div>
        </div> */}
      </div>
    );
  }
}

export default AddAssetsDialog;
