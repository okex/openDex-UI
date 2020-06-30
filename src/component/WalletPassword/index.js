import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import Input from '_component/Input';
import Icon from '_src/component/IconLite';
import ValidateCheckbox from '_component/ValidateCheckbox';
import Config from '_constants/Config';

// import './index.less';

const { lengthReg, chartReg } = Config.pwdValidate;
class index extends Component {
  static propTypes = {
    // value: PropTypes.string,
    allowClear: PropTypes.bool,
    placeholder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onChange: PropTypes.func
  }
  static defaultProps = {
    // value: '',
    allowClear: false,
    placeholder: false,
    onChange: () => {}
  }
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      lengthCheck: 'none',
      chartCheck: 'none',
      value: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!(this.state.lengthCheck === 'right') && !(this.state.chartCheck === 'right')) {
      if (nextProps.updateLengthCheck || nextProps.updateChartCheck) {
        this.setState({
          lengthCheck: nextProps.updateLengthCheck,
          chartCheck: nextProps.updateChartCheck
        });
      }
    }
  }
  toogleInputType = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }
  changeValue = (e) => {
    const value = e.target.value;
    const lengthCheck = lengthReg.test(value) ? 'right' : 'wrong';
    const chartCheck = chartReg.test(value) ? 'right' : 'wrong';
    return this.setState({
      value,
      lengthCheck,
      chartCheck,
    }, () => {
      return this.props.onChange({ value, lengthCheck, chartCheck });
    });
  }
  handlePaste = (e) => {
    e.preventDefault();
  }
  render() {
    const { value } = this.state;
    const { allowClear, placeholder } = this.props;
    const { showPassword, lengthCheck, chartCheck } = this.state;
    return (
      <div className="wallet-password-container">
        <Input
          // type="password"
          value={value}
          placeholder={placeholder || toLocale('wallet_setPassword')}
          theme="dark"
          onChange={this.changeValue}
          onCompositionStart={this.handleCompositionStart}
          onCompositionUpdate={this.handleCompositionUpdate}
          onCompositionEnd={this.handleCompositionEnd}
          onPaste={this.handlePaste}
          className={showPassword ? 'show' : ''}
          allowClear={allowClear}
          suffix={
            () => {
              const IconClsName = showPassword ? 'icon-icon_display' : 'icon-icon_hide';
              return <Icon className={IconClsName} onClick={this.toogleInputType} />;
            }
          }
        />
        <ValidateCheckbox type={lengthCheck} className="mar-top8">
          {toLocale('wallet_password_lengthValidate')}
        </ValidateCheckbox>
        <ValidateCheckbox type={chartCheck} className="mar-top8">
          {toLocale('wallet_password_chartValidate')}
        </ValidateCheckbox>
      </div>
    );
  }
}

export default index;
