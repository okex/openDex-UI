import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../IconLite';
import OkPagination from './OkPagination';

function noop() {}

export default class Pagination extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    defaultCurrent: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    defaultPageSize: PropTypes.number,
    onChange: PropTypes.func,
    hideOnSinglePage: PropTypes.bool,
    showQuickJumper: PropTypes.bool,
    showTotal: PropTypes.func,
    itemRender: PropTypes.func,
    size: PropTypes.string,
    dark: PropTypes.bool,
    totalPage: PropTypes.number,
  };

  static defaultProps = {
    prefixCls: 'ok-ui-pagination',
    current: 1,
    defaultCurrent: 1,
    total: 100,
    pageSize: 10,
    defaultPageSize: 10,
    onChange: noop,
    hideOnSinglePage: true,
    showQuickJumper: false,
    showTotal: noop,
    dark: false,
    size: '',
  };

  getIconsProps = () => {
    const { prefixCls } = this.props;
    const prevIcon = (
      <a className={`${prefixCls}-item-link`}>
        <Icon type="left" />
      </a>
    );
    const nextIcon = (
      <a className={`${prefixCls}-item-link`}>
        <Icon type="right" />
      </a>
    );
    const jumpPrevIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>
          <Icon className={`${prefixCls}-item-link-icon`} type="double-left" />
          <span className={`${prefixCls}-item-ellipsis`}>•••</span>
        </div>
      </a>
    );
    const jumpNextIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>
          <Icon className={`${prefixCls}-item-link-icon`} type="double-right" />
          <span className={`${prefixCls}-item-ellipsis`}>•••</span>
        </div>
      </a>
    );
    return {
      prevIcon,
      nextIcon,
      jumpPrevIcon,
      jumpNextIcon,
    };
  };

  render() {
    const { className, size, locale, ...restProps } = this.props;
    const isSmall = size === 'small';
    return (
      <OkPagination
        {...restProps}
        {...this.getIconsProps()}
        className={classNames(className, { mini: isSmall })}
        locale={locale}
      />
    );
  }
}
