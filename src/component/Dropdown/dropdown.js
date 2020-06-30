import React from 'react';
import PropTypes from 'prop-types';
import RcDropdown from 'rc-dropdown';

import './index.less';

class DropDown extends React.Component {
    static propTypes = {
      /** 菜单是否禁用 */
      disabled: PropTypes.bool,
      /** 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 */
      getPopupContainer: PropTypes.func,
      /** @ok/Menu 组件 */
      overlay: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
      ]),
      /** 下拉菜单,根元素的className名称 */
      overlayClassName: PropTypes.string,
      /** 下拉菜单,根元素的样式 */
      overlayStyle: PropTypes.object,
      /** 菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight */
      placement: PropTypes.string,
      /** 触发下拉的行为, 移动端不支持 hover */
      trigger: PropTypes.array,
      /** 打开下拉列表时触发器的className */
      openClassName: PropTypes.string,
      /** 菜单显示状态改变时调用，参数为 visible */
      onVisibleChange: PropTypes.func,
      /** 工具提示最初是否可见 */
      defaultVisible: PropTypes.bool,
      /** 单击叠加时调用 */
      onOverlayClick: PropTypes.func,
      /** 叠加的宽度是否必须小于触发器的宽度 */
      minOverlayWidthMatchTrigger: PropTypes.bool,

    };

    static defaultProps = {
      getPopupContainer: () => { return document.body; },
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
        prefixCls: 'ok-ui-dropdown'
      };
      return <RcDropdown {...this.props} {...fixedProps} />;
    }
}

export default DropDown;
