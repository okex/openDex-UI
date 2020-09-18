import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../IconLite';
import './index.less';

const arrowRenderer = ({ isOpen }) => {
  return (
    <Icon
      className={classNames({ 'icon-Unfold': true, 'arrow-open': isOpen })}
    />
  );
};

export default class ReactSelect extends React.PureComponent {
  static propTypes = {
    hasSearch: PropTypes.bool,
    small: PropTypes.bool,
    theme: PropTypes.string,
  };
  static defaultProps = {
    hasSearch: false,
    small: false,
    theme: '',
  };
  render() {
    const { className, small, theme, hasSearch, ...props } = this.props;
    const selectEle = (
      <Select
        {...props}
        className={classNames({
          'ok-select': true,
          [className]: className,
          small,
          [theme]: theme,
        })}
        arrowRenderer={arrowRenderer}
      />
    );
    if (hasSearch) {
      return (
        <div
          className={classNames({
            'ok-select-wrap': true,
            small,
            [theme]: theme,
          })}
        >
          <Icon className="icon-enlarge" />
          {selectEle}
        </div>
      );
    }
    return selectEle;
  }
}
