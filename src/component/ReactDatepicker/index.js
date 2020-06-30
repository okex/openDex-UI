import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import Icon from '../IconLite';
import './index.less';

export default class ReactDatepicker extends React.PureComponent {
  static propTypes = {
    /** 是否是小尺寸 */
    small: PropTypes.bool,
    /** 主题（dark） */
    theme: PropTypes.string,
    /** 隐藏日历图标 */
    hideIcon: PropTypes.bool,
  };
  static defaultProps = {
    small: false,
    theme: '',
    hideIcon: false,
  };

  render() {
    const {
      className, small, theme, hideIcon, ...props
    } = this.props;
    return (
      <div className={classNames({ 'ok-datepicker-wrapper': true, [theme]: theme })}>
        {!hideIcon && <Icon className="icon-date" />}
        <DatePicker
          className={
            classNames({
              'ok-datepicker': true,
              [className]: className,
              small,
              [theme]: theme,
              'hide-icon': hideIcon
            })
          }
          {...props}
          isClearable={false}
        />
      </div>
    );
  }
}
