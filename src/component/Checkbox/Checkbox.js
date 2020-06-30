import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Checkbox.less';

const prefixCls = 'ok-ui-checkbox';

export default class Checkbox extends React.Component {
  static propTypes = {
    /** 是否被选中 可选 */
    checked: PropTypes.bool,
    /** 是否初始被选中 可选 默认false */
    defaultChecked: PropTypes.bool,
    /** 是否禁止 可选 */
    disabled: PropTypes.bool,
    /** 变化时回调函数 必须传 */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    defaultChecked: false,
    disabled: false,
    onChange: null,
  };

  constructor(props) {
    super(props);

    const checked = 'checked' in props ? props.checked : props.defaultChecked;
    this.state = {
      checked
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }

  checkboxChange = (e) => {
    const checked = e.target.checked;
    this.setState({
      checked
    });
    // 兼容旧版本写法
    this.props.onChange(checked, {
      target: Object.assign({}, this.props, {
        checked
      })
    });
    // e.stopPropagation();
    // e.preventDefault();
  };

  render() {
    const {
      disabled
    } = this.props;
    const { checked } = this.state;
    // 控制check-box的样式
    const classContent = classnames({
      checkbox: true,
      'checkbox-checked': checked,
      'checkbox-disabled': disabled
    });
    // label 外层样式
    const classWrapper = classnames({
      'checkbox-wrapper': true,
      'checkbox-wrapper-checked': checked,
      'checkbox-wrapper-disabled': disabled
    });
    return (
      <section className={`${prefixCls}`}>
        <label className={classWrapper}>
          <span className={classContent}>
            <input
              type="checkbox"
              placeholder=""
              checked={checked}
              onChange={(e) => { this.checkboxChange(e); }}
              className="check-input"
              disabled={disabled}
            />
            <span className="checkbox-inner" />
          </span>
          <span className="check-des">{this.props.children}</span>
        </label>
      </section>
    );
  }
}
