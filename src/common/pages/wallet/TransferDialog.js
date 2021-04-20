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
@connect(mapStateToProps, mapDispatchToProps)
class TransferDialog extends Component {
  constructor(props) {
    super(props);
    this.feeToken = this.props.valuationToken;
    this.addrReg = env.envConfig.isMainnet ? /^okexchain/i : /^ex/i;
    this.loadingDur = 500;
    this.transDur = 2500;
    this.initState = {
      step: 1,
      symbol: '',
      address: '',
      addressErr: false,
      addressErrType: 'format',
      amount: '',
      amountErr: false,
      note: '',
      noteErr: false,
      fee: env.envConfig.fee,
      feeErr: false,
      pwdErr: '',
      available: 0,
      processingPwd: false,
    };
    this.state = {
      transferring: false,
      ...this.initState,
      check: !isLpToken(props.symbol),
      hideCheck: !isLpToken(props.symbol),
    };
    this.feeLeft = 0;
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentWillReceiveProps(nextProps) {
    if (this.addr) {
      const { show, symbol } = nextProps;
      if (show !== this.props.show) {
        if (show) {
          const idx = this.props.tokenList.findIndex((t) => t.value === symbol);
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

  fetchFeeTokenAsset = (symbol) => {
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
        available: util
          .precisionInput(calc.sub(this.feeLeft, fee, false))
          .replace(/,/g, ''),
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

  onChange = (type) => (v) => {
    let value = v.target ? v.target.value : v;
    this.setState({
      [type]: value,
      [`${type}Err`]: false,
    });
    if (type === 'amount') {
      value = FormatNum.CheckInputNumber(value, 8);
      this.setState({
        [type]: value,
        feeErr: false,
      });
    }
  };

  onBlur = (type) => (v) => {
    const value = v.target ? v.target.value : v;
    let err = false;
    const { available, fee } = this.state;
    if (type === 'address') {
      if (value.trim() && !this.addrReg.test(value)) {
        this.setState({
          addressErrType: 'format',
        });
        err = true;
      }
      if (value.trim().toLowerCase() === this.addr.toLowerCase()) {
        this.setState({
          addressErrType: 'same',
        });
        err = true;
      }
    }
    if (type === 'amount') {
      err = util.compareNumber(available, value);
      if (!err && util.compareNumber(this.feeLeft, fee)) {
        this.setState({
          feeErr: true,
        });
      } else {
        this.setState({
          feeErr: false,
        });
      }
    }
    this.setState({
      [`${type}Err`]: err,
    });
  };

  allIn = () => {
    const { available } = this.state;
    this.setState({ amount: util.precisionInput(available, 8, false) });
  };

  setSymbol = (symbol, checkFee = true) => {
    this.setState(
      { symbol, check: !isLpToken(symbol), hideCheck: !isLpToken(symbol) },
      () => {
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
      }
    );
  };

  canProceed = () => {
    const { fee, symbol, address, amount, available, check } = this.state;
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

  onTypeChange = ({ value }) => {
    this.setSymbol(value);
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
              this._transfer(privateKey);
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

  _transfer = (privateKey = '') => {
    const { onClose, onSuccess, okexchainClient } = this.props;
    const { symbol, address, amount, note, available } = this.state;
    onClose();
    setTimeout(() => {
      this.setState({ transferring: true });
    }, 0);
    let amountStr = util.precisionInput(amount).replace(/,/g, '');
    if (util.precisionInput(amount, 8) === util.precisionInput(available, 8)) {
      amountStr = available;
    }
    okexchainClient.setAccountInfo(privateKey).then(() => {
      console.log('发起交易');
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
        .catch((err) => {
          console.log(err);
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
  };

  toggleCheck = (e) => {
    this.setState({ check: e.target.checked });
  };

  submit = () => {
    if (util.isWalletConnect()) {
      this._transfer();
    } else {
      this.setState({ step: 3 }, this.clearPwd);
    }
  };

  render() {
    const { state, props } = this;
    const {
      step,
      fee,
      symbol,
      address,
      amount,
      available,
      note,
      addressErr,
      addressErrType,
      amountErr,
      feeErr,
      pwdErr,
      processingPwd,
      transferring,
      hideCheck,
      check,
    } = state;
    const { show, onClose, tokenList, tokenMap } = props;
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
                    {addressErr && (
                      <p className="error">
                        {toLocale(`trans_err_addr_${addressErrType}`)}
                      </p>
                    )}
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
                    <div className="trans-op-right">
                      <span>{getLpTokenStr(original_symbol)}</span>
                      <a onClick={this.allIn}>{toLocale('all')}</a>
                    </div>
                    <p className="amount-left-info">
                      <span>{toLocale('trans_available')}</span>
                      {calc.showFloorTruncation(available, 8, true)}
                    </p>
                    {amountErr && (
                      <p className="error">
                        {toLocale('trans_available_not_enough')}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_fee')}</td>
                  <td>
                    <div className="fee">
                      <span>{fee}</span>
                      <span>{this.props.valuationToken.toUpperCase()}</span>
                    </div>
                    {feeErr && (
                      <p className="error">
                        {toLocale('trans_fee_not_enough')}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_note')}</td>
                  <td>
                    <input
                      maxLength={256}
                      className="trans"
                      onChange={this.onChange('note')}
                      value={note}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {!hideCheck && (
              <label className="cursor-pointer lp-checkbox">
                <Checkbox
                  onChange={this.toggleCheck}
                  className="content-box"
                  checked={check}
                />
                {toLocale('lp token transfer')}
              </label>
            )}
            <Button
              block
              type={Button.btnType.primary}
              style={{ marginTop: 24 }}
              onClick={() => {
                this.setState({ step: 2 });
              }}
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
                  <td>
                    {fee} {this.feeToken.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td>{toLocale('trans_middle_step_show_note')}</td>
                  <td>{note}</td>
                </tr>
              </tbody>
            </table>
            <div className="middle-step-btns">
              <Button
                type={Button.btnType.default}
                onClick={() => {
                  this.setState({ step: 1 });
                }}
              >
                {toLocale('go_back')}
              </Button>
              <Button type={Button.btnType.primary} onClick={this.submit}>
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
          updateWarning={(err) => {
            this.setState({ pwdErr: err });
          }}
          warning={pwdErr}
        />
        <div className={`trans-loading ${transferring ? '' : 'hide'}`}>
          <div className="loading-icon">
            <Icon className="icon-loadingCopy" isColor />
          </div>
        </div>
      </div>
    );
  }
}

export default TransferDialog;
