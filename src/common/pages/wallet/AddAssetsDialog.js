import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { toLocale } from '_src/locale/react-locale';
import { Dialog } from '_component/Dialog';
import { Button } from '_component/Button';
import operationContract from './operationContract.js'
import web3Util from '_src/utils/web3Util';
import InputNum from '_component/InputNum';
import './AddAssetsDialog.less';
import ThemeSetting from '../common/ThemeSetting.js';

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
  constructor(props) {
    super(props)
    this.addrReg = /^0x\w*[a-zA-Z]+/
    this.initState = {
      address: '',
      addressErr: false,
      shortName: '',
      shortNameErr: false,
      precision: '',
      precisionErr: false,
      canInput: true
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
  }
  canProceed = () => {
    const { address, addressErr, shortName, shortNameErr, precision, precisionErr } = this.state;
    if (addressErr || shortNameErr || precisionErr) return false
    return address && shortName && precision
  };
  onBlur = (type) => {
    const resetFn = () => {
      this.setState({
        canInput: true,
        shortName: '',
        precision: '',
        shortNameErr: false,
        precisionErr: false
      })
    }
    return async (event) => {
      const value = event.target ? event.target.value : event;
      let err = false;
      if (type === 'address') {
        if (!value.trim() || !this.addrReg.test(value)) {
          err = true;
          resetFn()
        } else {
          const response = await web3Util.contract(value)
          if (!response) {
            err = true
            resetFn()
          } else if (!!response.symbol && !!response.decimals) {
            this.setState({
              canInput: false,
              shortName: response.symbol,
              precision: response.decimals,
              shortNameErr: false,
              precisionErr: false
            })
          } else {
            this.setState({ canInput: true })
          }
        }
      }
      if (type === 'shortName') {
        if (!value.trim()) err = true
        else if (value.trim().length > 20) err = true
      }
      if (type === 'precision') {
        if (!value.trim()) err = true
        if (+value < 0 || +value > 18) err = true
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
    const { onClose, onSuccess } = this.props;
    const { address, shortName, precision } = this.state
    operationContract.add(address, shortName, precision)
    onClose()
    onSuccess()
  };

  render() {
    const {
      address,
      shortName,
      precision,
      canInput,
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
                      maxLength={20}
                      value={shortName}
                      onBlur={this.onBlur('shortName')}
                      onChange={this.onChange('shortName')}
                      placeholder={toLocale('dex_input_label_short_name')}
                      style={canInput ? {} : { cursor: 'no-drop' }}
                      disabled={!canInput}
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
                    <InputNum 
                      precision={0}
                      className="assets-input amount"
                      onBlur={this.onBlur('precision')}
                      onChange={this.onChange('precision')}
                      value={precision}
                      placeholder={toLocale('dex_input_label_precision')}
                      style={canInput ? {} : { cursor: 'no-drop' }}
                      disabled={!canInput}
                    />
                    {precisionErr && (
                      <p className="error">
                        {precision === '' ? toLocale('dex_input_err_tip_precision') : toLocale('dex_input_err_tip_precision2')}
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
      </div>
    );
  }
}

export default AddAssetsDialog;
