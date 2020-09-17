import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
// import InputNum from '_component/InputNum';
import URL from '_src/constants/URL';
import { Dialog } from '_component/Dialog';
import { Button } from '_component/Button';
import Select from '_component/ReactSelect';
import FormatNum from '_src/utils/FormatNum';
import { calc } from '_component/okit';
import PasswordDialog from '_component/PasswordDialog';
import util from '../../utils/util';
import ont from '../../utils/dataProxy';
import './TransferDialog.less';


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
/* eslint-disable react/sort-comp */
@connect(mapStateToProps, mapDispatchToProps)
class TransferDialog extends Component {
  constructor(props) {
    super(props);
    this.feeToken = this.props.valuationToken;
    this.addrReg = /^okexchain/i;
    this.loadingDur = 500; // 转账loading至少展示时间
    this.transDur = 2500; // 转账结果提示显示时间
    this.initState = {
      step: 1, // 步骤
      symbol: '', // 当前选中币
      address: '', // 对方地址
      addressErr: false, // 对方地址格式错误
      addressErrType: 'format', // 对方地址格式错误类型
      amount: '', // 转账数量
      amountErr: false,
      note: '', // 备注
      noteErr: false,
      fee: 0.02, // 一期写死
      feeErr: false,
      pwdErr: '',
      available: 0, // 可用资产
      processingPwd: false, // 正在处理密码
    };
    this.state = {
      transferring: false, // 正在处理划转
      ...this.initState,
    };
    this.feeLeft = 0; // 手续费资产
    this.addr = window.OK_GLOBAL.senderAddr;
  }
  componentWillReceiveProps(nextProps) {
    if (this.addr) {
      const { show, symbol } = nextProps;
      if (show !== this.props.show) { // 打开转账窗口
        if (show) {
          const idx = this.props.tokenList.findIndex((t) => { return t.value === symbol; });
          this.fetchFeeTokenAsset(symbol);
          if (idx > -1) {
            this.setSymbol(symbol, false);
          }
          setTimeout(() => {
            document.querySelector('.trans.address').focus();
          }, 200);
        }
        if (this.props.show) {
          this.feeLeft = 0;
          this.setState(Object.assign(this.state, { ...this.initState }));
        }
      }
    }
  }
  fetchFeeTokenAsset = (symbol) => { // 获取手续费币种的余额
    ont.get(`${URL.GET_ACCOUNTS}/${this.addr}`, { params: { symbol: this.feeToken } }).then(({ data }) => {
      const { currencies } = data;
      const assets = currencies || [];
      if (assets.length) {
        this.feeLeft = Number(assets[0].available);
        if (symbol === this.feeToken) {
          this.calAvaIsFeeToken();
        }
      }
    });
  };
  calAvaIsFeeToken = () => {
    const { fee } = this.state;
    if (this.feeLeft > fee) {
      this.setState({ available: calc.sub(this.feeLeft, fee) });
    } else {
      this.setState({ available: 0 });
    }
  };
  fetchAsset = (symbol) => {
    ont.get(`${URL.GET_ACCOUNTS}/${this.addr}`, { params: { symbol } }).then(({ data }) => {
      const { currencies } = data;
      const assets = currencies || [];
      if (assets.length) {
        this.setState({ available: Number(assets[0].available) });
      }
    });
  };
  onChange = (type) => {
    return (v) => {
      let value = v.target ? v.target.value : v;
      this.setState({
        [type]: value,
        [`${type}Err`]: false
      });
      if (type === 'amount') {
        value = FormatNum.CheckInputNumber(value, 8);
        this.setState({
          [type]: value,
          feeErr: false
        });
      }
    };
  };
  onBlur = (type) => {
    return (v) => {
      const value = v.target ? v.target.value : v;
      let err = false;
      const { available, fee } = this.state;
      if (type === 'address') {
        if (value.trim() && !this.addrReg.test(value)) {
          this.setState({
            addressErrType: 'format'
          });
          err = true;
        }
        if (value.trim().toLowerCase() === this.addr.toLowerCase()) {
          this.setState({
            addressErrType: 'same'
          });
          err = true;
        }
      }
      if (type === 'amount') {
        err = Number(value) > available;
        if (!err && this.feeLeft < fee) {
          this.setState({
            feeErr: true
          });
        } else {
          this.setState({
            feeErr: false
          });
        }
      }
      this.setState({
        [`${type}Err`]: err
      });
    };
  };
  allIn = () => {
    const { available } = this.state;
    this.setState({ amount: available });
  };
  setSymbol = (symbol, checkFee = true) => {
    this.setState({ symbol }, () => {
      if (symbol) {
        this.setState({
          available: 0, amount: '', amountErr: false, feeErr: false
        }, () => {
          if (symbol === this.feeToken) {
            if (checkFee) {
              this.calAvaIsFeeToken();
            }
          } else {
            this.fetchAsset(symbol);
          }
        });
      }
    });
  };
  canProceed = () => {
    const {
      fee, symbol,
      address, amount, available
    } = this.state;
    return this.props.tokenList.length && symbol &&
      address.trim() && this.addrReg.test(address.trim()) &&
      Number(amount) && Number(amount) <= available &&
      this.feeLeft > fee && this.addr && this.addr.toLowerCase() !== address.trim().toLowerCase();
  };
  onTypeChange = ({ value }) => {
    this.setSymbol(value);
  };
  transfer = (pwd) => {
    // 2019-08-13 增加用户清空全部缓存的判断
    if (!util.isLogined()) {
      window.location.reload();
    }

    if (this.state.processingPwd) return;
    this.setState({
      processingPwd: true
    }, () => {
      setTimeout(() => {
        this.props.commonAction.validatePassword(pwd, (privateKey) => {
          const { onClose, onSuccess, okexchainClient } = this.props;
          const {
            symbol, address, amount, note
          } = this.state;
          onClose();
          this.setState({ transferring: true });
          // const myAddr = this.addr; // myAddr,
          const amountStr = Number(amount).toFixed(8);
          okexchainClient.setAccountInfo(privateKey).then(() => {
            okexchainClient.sendSendTransaction(
              address,
              amountStr,
              symbol,
              note
            ).then((res) => {
              if (res.result.code) {
                // 失败，提示原因
                setTimeout(() => {
                  this.setState({ transferring: false });
                  const dialog = Dialog.show({
                    theme: 'dark trans-alert',
                    hideCloseBtn: true,
                    children: <div className="trans-msg"><Icon className="icon-icon_fail" isColor />{toLocale('trans_fail')}</div>,
                  });
                  setTimeout(() => {
                    dialog.destroy();
                  }, this.transDur);
                }, this.loadingDur);
              } else {
                // 成功
                setTimeout(() => {
                  this.setState({ transferring: false });
                  const dialog = Dialog.show({
                    theme: 'dark trans-alert',
                    hideCloseBtn: true,
                    children: <div className="trans-msg"><Icon className="icon-icon_success" isColor />{toLocale('trans_success')}</div>,
                  });
                  setTimeout(() => {
                    dialog.destroy();
                    onSuccess();
                  }, this.transDur);
                }, this.loadingDur);
              }
            }).catch(() => {
              // 失败
              setTimeout(() => {
                this.setState({ transferring: false });
                const dialog = Dialog.show({
                  theme: 'dark trans-alert',
                  hideCloseBtn: true,
                  children: <div className="trans-msg"><Icon className="icon-icon_fail" isColor />{toLocale('trans_fail')}</div>,
                });
                setTimeout(() => {
                  dialog.destroy();
                }, this.transDur);
              }, this.loadingDur);
            });
          });
        }, () => {
          this.setState({ pwdErr: toLocale('trans_err_pwd'), processingPwd: false });
        });
      }, 20);
    });
  };
  render() {
    const { state, props } = this;
    const {
      step, fee, symbol,
      address, amount, available, note,
      addressErr, addressErrType, amountErr, feeErr, pwdErr,
      processingPwd, transferring,
    } = state;
    const {
      show, onClose, tokenList, tokenMap
    } = props;
    const { original_symbol } = tokenMap[symbol] || { original_symbol: '' };
    return (
      <div className="transfer-container">
        <Dialog
          theme="base-dialog"
          title={toLocale(`trans_step_${step}`)}
          openWhen={show && [1, 2].includes(step)}
          onClose={onClose}
        >
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <table>
              <tbody>
                <tr>
                  <td>{toLocale('trans_choose_token')}</td>
                  <td>
                    <Select
                      placeholder={toLocale('please_select')}
                      clearable={false}
                      searchable
                      theme="dark"
                      options={tokenList}
                      value={symbol}
                      onChange={this.onTypeChange}
                      style={{ width: '100%' }}
                      noResultsText={toLocale('trans_no_token_found')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_address')}</td>
                  <td>
                    <input
                      autoComplete="address"
                      className="trans address"
                      maxLength={50}
                      value={address}
                      onBlur={this.onBlur('address')}
                      onChange={this.onChange('address')}
                    />
                    { addressErr && <p className="error">{toLocale(`trans_err_addr_${addressErrType}`)}</p>}
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_amount')}</td>
                  <td>
                    <input
                      className="trans amount"
                      onBlur={this.onBlur('amount')}
                      onChange={this.onChange('amount')}
                      value={amount}
                    />
                    <div className="trans-op-right"><span>{original_symbol.toUpperCase()}</span><a onClick={this.allIn}>{toLocale('all')}</a></div>
                    <p className="amount-left-info"><span>{toLocale('trans_available')}</span>{calc.showFloorTruncation(available, 8, false)}</p>
                    { amountErr && <p className="error">{toLocale('trans_available_not_enough')}</p> }
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_fee')}</td>
                  <td>
                    <div className="fee"><span>{fee}</span><span>{this.props.valuationToken.toUpperCase()}</span></div>
                    { feeErr && <p className="error">{toLocale('trans_fee_not_enough')}</p> }
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_note')}</td>
                  <td><input maxLength={256} className="trans" onChange={this.onChange('note')} value={note} /></td>
                </tr>
              </tbody>
            </table>
            <Button
              block
              type={Button.btnType.primary}
              style={{ marginTop: 24 }}
              onClick={() => { this.setState({ step: 2 }); }}
              disabled={!this.canProceed()}
            >
              {toLocale('next_step')}
            </Button>
          </div>
          <div style={{ display: step === 2 ? 'block' : 'none' }}>
            <table className="show">
              <tbody>
                <tr>
                  <td>{toLocale('trans_middle_step_show_token')}</td>
                  <td>{original_symbol.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>{toLocale('trans_middle_step_show_sender')}</td>
                  <td>{this.addr}</td>
                </tr>
                <tr>
                  <td>{toLocale('trans_middle_step_show_taker')}</td>
                  <td>{address}</td>
                </tr>
                <tr>
                  <td>{toLocale('trans_middle_step_show_amount')}</td>
                  <td>{amount}</td>
                </tr>
                <tr>
                  <td>{toLocale('trans_middle_step_show_fee')}</td>
                  <td>{fee} {this.feeToken.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>{toLocale('trans_middle_step_show_note')}</td>
                  <td>{note}</td>
                </tr>
              </tbody>
            </table>
            <div className="middle-step-btns">
              <Button type={Button.btnType.default} onClick={() => { this.setState({ step: 1 }); }}>{toLocale('go_back')}</Button>
              <Button
                type={Button.btnType.primary}
                onClick={() => { this.setState({ step: 3 }, this.clearPwd); }}
              >
                {toLocale('ensure')}
              </Button>
            </div>
          </div>
        </Dialog>
        <PasswordDialog
          isShow={show && [3].includes(step)}
          onClose={onClose}
          onEnter={this.transfer}
          btnLoading={processingPwd}
          updateWarning={(err) => { this.setState({ pwdErr: err }); }}
          warning={pwdErr}
        />
        <div className={`trans-loading ${transferring ? '' : 'hide'}`} >
          <div className="loading-icon"><Icon className="icon-loadingCopy" isColor /></div>
        </div>
      </div>
    );
  }
}

export default TransferDialog;
