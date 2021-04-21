import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Checkbox.less';

const prefixCls = 'ok-ui-checkbox';

export default class CheckboxGroup extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.array,
    options: PropTypes.array,
    defaultValue: PropTypes.array,
  };

  static defaultProps = {
    value: '',
    options: [],
    defaultValue: [],
    disabled: false,
    onChange: null,
  };

  constructor(props) {
    super(props);

    const value = props.value || props.defaultValue || [];
    this.state = {
      value,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value || [],
      };
    }
    return null;
  }

  getOptions = () => {
    const { options } = this.props;
    return options.map((item) => {
      if (typeof item === 'string') {
        return {
          value: item,
          label: item,
        };
      }
      return item;
    });
  };

  toggleOption = (option) => {
    const optionIndex = this.state.value.indexOf(option.value);
    const value = [...this.state.value];
    if (optionIndex === -1) {
      value.push(option.value);
    } else {
      value.splice(optionIndex, 1);
    }
    this.setState({ value });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { disabled } = this.props;
    const { value } = this.state;
    return (
      <div className={`${prefixCls}`}>
        {this.getOptions().map((item) => (
          <label
            key={item.value}
            className={classnames({
              'checkbox-wrapper': true,
              'checkbox-wrapper-checked': value.indexOf(item.value) !== -1,
              'checkbox-wrapper-disabled': item.disabled
                ? item.disabled
                : disabled,
            })}
          >
            <span
              className={classnames({
                checkbox: true,
                'checkbox-checked': value.indexOf(item.value) !== -1,
                'checkbox-disabled': item.disabled ? item.disabled : disabled,
              })}
            >
              <input
                type="checkbox"
                placeholder=""
                checked={value.indexOf(item.value) !== -1}
                onChange={() => {
                  this.toggleOption(item);
                }}
                className="check-input"
                disabled={item.disabled ? item.disabled : disabled}
              />
              <span className="checkbox-inner" />
            </span>
            <span className="check-des">{item.label}</span>
          </label>
        ))}
      </div>
    );
  }
}
