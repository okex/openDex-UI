import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';
import Menu from '../Menu';
import Icon from '../IconLite';
import LanguageDataList from './language_data';
import './index.less';

export default class LanguageSwitch extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    minWidth: PropTypes.string,
    direction: PropTypes.string,
    trigger: PropTypes.array,
    usable: PropTypes.array,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    overlayClassName: PropTypes.string,
    dropDownMatchSelectWidth: PropTypes.bool,
    titleMode: PropTypes.string,
    titleRender: PropTypes.func,
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
      currentLanguage: defaultValue,
    };
    this.languageList = usable.map((item) =>
      typeof item === 'string' ? LanguageDataList[item] : item
    );
  }

  getTitleDom = (currentItem) => {
    const { titleMode, titleRender } = this.props;
    const titleDom = {
      all: (
        <>
          <Icon
            className={currentItem.icon}
            isColor={true}
            style={{ width: '20px', height: '18px', flexShrink: 0 }}
          />
          <span className="text-hidden">{currentItem.name}</span>
        </>
      ),
      icon: (
        <Icon
          className={currentItem.icon}
          isColor={true}
          style={{ width: '20px', height: '18px', flexShrink: 0 }}
        />
      ),
    };
    return titleRender ? titleRender(currentItem) : titleDom[titleMode];
  };

  handlePhoneListSelect = (item) => {
    const { onSelect } = this.props;
    this.setState({ currentLanguage: item.key });
    const result = this.languageList.filter((data) => data.rel === item.key);
    onSelect && onSelect(result.length > 0 ? result[0] : item.key);
  };

  render() {
    let currentItem = {};

    const { currentLanguage } = this.state;
    const {
      className,
      overlayClassName,
      dropDownMatchSelectWidth,
      direction,
      trigger,
      isShowArrow,
      titleMode,
      minWidth,
    } = this.props;

    const languageListIndex =
      this.languageList.length > 0 && this.languageList[0];

    const currentRel = currentLanguage || languageListIndex.rel || 'zh_CN';

    const NewMenus = (
      <Menu
        mode="vertical"
        style={{ minWidth: dropDownMatchSelectWidth ? minWidth : 'auto' }}
        onSelect={this.handlePhoneListSelect}
      >
        {this.languageList.length > 0 &&
          this.languageList.map((item) => {
            if (item.rel !== currentRel) {
              return (
                <Menu.Item
                  key={item.rel}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    className={item.icon}
                    isColor={true}
                    style={{ width: '20px', height: '18px', flexShrink: 0 }}
                  />
                  <span style={{ marginLeft: '8px' }}>{item.name}</span>
                </Menu.Item>
              );
            }
            currentItem = item;
            return null;
          })}
      </Menu>
    );
    let isShowArrowProps = isShowArrow;
    if (titleMode === 'icon') {
      isShowArrowProps = false;
    }
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
            {this.getTitleDom(currentItem)}
            {isShowArrowProps && (
              <Icon
                className="icon-Unfold"
                style={{
                  fontSize: '12px',
                  color: '#999',
                  flexShrink: 0,
                  marginLeft: '12px',
                }}
              />
            )}
          </div>
        </Dropdown>
      </div>
    );
  }
}
