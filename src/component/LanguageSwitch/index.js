import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';
import Menu from '../Menu';
import Icon from '../IconLite';
import LanguageDataList from './language_data';
import './index.less';

export default class LanguageSwitch extends React.Component {
  static propTypes = {
    /** 默认值 */
    defaultValue: PropTypes.string,
    /** 多语言选择器最小宽度 */
    minWidth: PropTypes.string,
    /** 多语言选择窗口弹出位置 bottomLeft bottomCenter bottomRight topLeft topCenter topRight */
    direction: PropTypes.string,
    /** 触发下拉窗口选择器，['click', 'hover'] */
    trigger: PropTypes.array,
    /** 由外部提供需要展示的多语言种类 */
    usable: PropTypes.array,
    /** 被选中时调用 */
    onSelect: PropTypes.func,
    /** 指定当前组件的类名,使用此类名去 DIY UI 样式 */
    className: PropTypes.string,
    /** 指定弹出窗口popup根节点的类名 */
    overlayClassName: PropTypes.string,
    /** 下拉菜单和选择器同宽 true: 同宽 false: 不同宽 */
    dropDownMatchSelectWidth: PropTypes.bool,
    /** 设置 LanguageSwitch 标题显示模式, { icon: '标题=icon', 'all': '标题=icon+文字'} */
    titleMode: PropTypes.string,
    /** 自定义头部样式 */
    titleRender: PropTypes.func,
    /** 是否显示标题右侧的下拉icon, 默认显示, { true: 显示, false: 不显示} */
    isShowArrow: PropTypes.bool,
  };

  static defaultProps = {
    defaultValue: '',
    minWidth: '134px',
    direction: 'topLeft',
    usable: ['zh_CN', 'en_US'],
    onSelect: () => {},
    className: '',
    overlayClassName: '',
    dropDownMatchSelectWidth: true,
    titleMode: 'all',
    titleRender: undefined,
    isShowArrow: true,
    trigger: ['hover'],
  };
  constructor(props) {
    super(props);
    const { usable, defaultValue } = props;
    this.state = {
      currentLanguage: defaultValue
    };
    // 初始化国家配置项
    this.languageList = usable.map((item) => {
      return typeof item === 'string' ? LanguageDataList[item] : item;
    });
  }
  // 显示标题
  getTitleDom= (currentItem) => {
    const { titleMode, titleRender } = this.props;
    const titleDom = {
      all: (
        <React.Fragment>
          <Icon
            className={currentItem.icon}
            isColor
            style={{ width: '20px', height: '18px', flexShrink: 0 }}
          />
          <span className="text-hidden" >{currentItem.name}</span>
        </React.Fragment>
      ),
      icon: (
        <Icon
          className={currentItem.icon}
          isColor
          style={{ width: '20px', height: '18px', flexShrink: 0 }}
        />
      )
    };
    // 优先展示自定义结构的 标题, 并且把当前选中的元素 传递到外部调用者事件中！
    return titleRender ? titleRender(currentItem) : titleDom[titleMode];
  };
  // 切换多语言事件
  handlePhoneListSelect=(item) => {
    const { onSelect } = this.props;
    this.setState({ currentLanguage: item.key });
    const result = this.languageList.filter((data) => {
      return data.rel === item.key;
    });
    // 执行外部传入的事件
    onSelect && onSelect(result.length > 0 ? result[0] : item.key);
  };
  render() {
    // 当前多语言 - 某一项 - item
    let currentItem = {};

    const { currentLanguage } = this.state;
    const {
      className, overlayClassName, dropDownMatchSelectWidth, direction, trigger, isShowArrow, titleMode, minWidth
    } = this.props;

    // 取多语言列表中的第一个语言为当前语言
    const languageListIndex = this.languageList.length > 0 && this.languageList[0];

    // 优先使用“使用者”传入的语言，否则使用上述的 “languageListIndex” 值。
    // 使用顺序 外部控制状态 > 默认 > 列表项第一个 > 'zh_CN'
    const currentRel = currentLanguage || languageListIndex.rel || 'zh_CN';

    // 分离出下啦列表窗口展示语言、当前语言
    const NewMenus = (
      <Menu
        mode="vertical"
        style={{ minWidth: dropDownMatchSelectWidth ? minWidth : 'auto' }}
        onSelect={this.handlePhoneListSelect}
      >
        {
          this.languageList.length > 0 && this.languageList.map((item) => {
            if (item.rel !== currentRel) {
              return (
                <Menu.Item
                  key={item.rel}
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Icon
                    className={item.icon}
                    isColor
                    style={{ width: '20px', height: '18px', flexShrink: 0 }}
                  />
                  <span style={{ marginLeft: '8px' }} >{item.name}</span>
                </Menu.Item>
              );
            }
            currentItem = item;
            return null;
          })
        }
      </Menu>
    );
    let isShowArrowProps = isShowArrow;
    // 只要titleMode === icon, 就不展示 Arrow。
    if (titleMode === 'icon') { isShowArrowProps = false; }
    return (
      <div
        className={`ok-ui-language-switch ${className} title-show-${titleMode}`}
        style={{ minWidth: titleMode === 'icon' ? 'auto' : minWidth }}
      >
        <Dropdown
          trigger={trigger}
          overlay={NewMenus}
          placement={direction}
          overlayClassName={overlayClassName}
          dropdownMatchSelectWidth={dropDownMatchSelectWidth}
        >
          <div className="show">
            {
              this.getTitleDom(currentItem)
            }
            {
              isShowArrowProps && (
                <Icon
                  className="icon-Unfold"
                  style={{
                    fontSize: '12px', color: '#999', flexShrink: 0, marginLeft: '12px'
                  }}
                />
              )
            }
          </div>
        </Dropdown>
      </div>
    );
  }
}
