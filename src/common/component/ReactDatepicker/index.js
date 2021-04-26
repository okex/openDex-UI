import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import Icon from '../IconLite';
import './index.less';

export default class ReactDatepicker extends React.PureComponent {
  static propTypes = {
    small: PropTypes.bool,
    theme: PropTypes.string,
    hideIcon: PropTypes.bool,
  };

  static defaultProps = {
    small: false,
    theme: '',
    hideIcon: false,
  };

  render() {
    const { className, small, theme, hideIcon, ...props } = this.props;
    return (
      <div
        className={classNames({
          'ok-datepicker-wrapper': true,
          [theme]: theme,
        })}
      >
        {!hideIcon && <Icon className="icon-date" />}
        <DatePicker
          className={classNames({
            'ok-datepicker': true,
            [className]: className,
            small,
            [theme]: theme,
            'hide-icon': hideIcon,
          })}
          {...props}
          isClearable={false}
        />
      </div>
    );
  }
}
