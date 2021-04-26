import React from 'react';
import PropTypes from 'prop-types';
import RcDropdown from 'rc-dropdown';

import './index.less';

class DropDown extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    overlay: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    overlayClassName: PropTypes.string,
    overlayStyle: PropTypes.object,
    placement: PropTypes.string,
    trigger: PropTypes.array,
    openClassName: PropTypes.string,
    onVisibleChange: PropTypes.func,
    defaultVisible: PropTypes.bool,
    onOverlayClick: PropTypes.func,
    minOverlayWidthMatchTrigger: PropTypes.bool,
  };

  static defaultProps = {
    getPopupContainer: () => document.body,
    placement: 'bottomLeft',
    trigger: ['hover'],
    onVisibleChange: () => {},
    disabled: false,
    minOverlayWidthMatchTrigger: false,
    overlayClassName: '',
    overlayStyle: null,
    openClassName: '',
    defaultVisible: false,
    onOverlayClick: () => {},
    overlay: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const fixedProps = {
      prefixCls: 'ok-ui-dropdown',
    };
    return <RcDropdown {...this.props} {...fixedProps} />;
  }
}

export default DropDown;
