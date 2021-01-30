import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { toLocale } from '_src/locale/react-locale';
import * as SwapAction from '_src/redux/actions/SwapAction';
import InputNum from '_component/InputNum';
import * as util from './util';
import Message from '_src/component/Message';
import Tooltip from '../../component/Tooltip';

function mapStateToProps(state) {
  const { setting } = state.SwapStore;
  return { setting };
}

function mapDispatchToProps(dispatch) {
  return {
    swapAction: bindActionCreators(SwapAction, dispatch),
  };
}
@connect(mapStateToProps, mapDispatchToProps)
export default class SwapSetting extends React.Component {
  constructor() {
    super();
    this.ratios = [
      { name: '0.1%', value: 0.1 },
      { name: '0.5%', value: 0.5 },
      { name: '1%', value: 1 },
    ];
  }

  changeSlippageTolerance = (value) => {
    const setting = { ...this.props.setting };
    if(Number(value) > 100) value = 100;
    setting.slippageTolerance = value;
    this.props.swapAction.setting(setting);
  };

  change = (ratio) => {
    this.changeSlippageTolerance(ratio.value);
  };

  confirm = () => {
    util.setting(this.props.setting);
    Message.success({
      content: toLocale('set confirmed'),
      duration: 3,
    });
  };

  render() {
    const ratios = this.ratios;
    const { setting } = this.props;
    return (
      <div className="swap-setting-container">
        <i className="iconfont iconmenu-administration" />
        <div className="panel-swap-setting">
          <div className="swap-setting-header">
            {toLocale('Advanced setting')}
          </div>
          <div className="swap-setting-content">
            <div className="space-between">
              <div className="left">{toLocale('Set slippage tolerance')}</div>
              <div className="right">
                <Tooltip
                  placement="left"
                  overlay={toLocale(
                    'Your transaction will revert if the price changes unfavorably by more than this percentage.'
                  )}
                >
                  <i className="help" />
                </Tooltip>
              </div>
            </div>
            <div className="space-between check-btns">
              <div className="left">
                <div className="check-btn-wrap">
                  {ratios.map((d, index) => (
                    <div
                      key={index}
                      className={classNames('check-btn-item', {
                        active: d.value == setting.slippageTolerance,
                      })}
                      onClick={() => this.change(d)}
                    >
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="right">
                <div className="check-btn-input">
                  <div className="input">
                    <InputNum
                      type="text"
                      value={setting.slippageTolerance}
                      onChange={this.changeSlippageTolerance}
                      precision={8}
                    />
                  </div>
                  <i>%</i>
                </div>
              </div>
            </div>
            <div className="setting-btn" onClick={this.confirm}>
              {toLocale('Confirm')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
