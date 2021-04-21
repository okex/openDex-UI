import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Checkbox.less';

const prefixCls = 'ok-ui-checkbox';

export default class Checkbox extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    checked: false,
    defaultChecked: false,
    disabled: false,
    onChange: null,
  };

  constructor(props) {
    super(props);

    const checked = 'checked' in props ? props.checked : props.defaultChecked;
    this.state = {
      checked,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }

  checkboxChange = (e) => {
    const { checked } = e.target;
    this.setState({
      checked,
    });
    this.props.onChange(checked, {
      target: { ...this.props, checked },
    });
  };

  render() {
    const { disabled } = this.props;
    const { checked } = this.state;
    const classContent = classnames({
      checkbox: true,
      'checkbox-checked': checked,
      'checkbox-disabled': disabled,
    });
    const classWrapper = classnames({
      'checkbox-wrapper': true,
      'checkbox-wrapper-checked': checked,
      'checkbox-wrapper-disabled': disabled,
    });
    return (
      <section className={`${prefixCls}`}>
        <label className={classWrapper}>
          <span className={classContent}>
            <input
              type="checkbox"
              placeholder=""
              checked={checked}
              onChange={(e) => {
                this.checkboxChange(e);
              }}
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
