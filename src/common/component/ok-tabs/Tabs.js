import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.less';
import TabPane from './TabPane';

class Tabs extends React.Component {
  static themeColor(theme) {
    return theme === 'dark' ? ' ok-tabs-dark-theme' : '';
  }

  constructor(props) {
    super(props);
    this.state = {
      active: props.defaultIndexKey,
      tabBarExtraContent: [],
    };
    this.tabPans = [];
    this.tabsk = [];
  }

  UNSAFE_componentWillMount() {
    const active = this.props.active || this.props.defaultIndexKey;
    const { tabBarExtraContent } = this.props;

    if (tabBarExtraContent) {
      this.setState({
        active,
        tabBarExtraContent: [<span key="1">{tabBarExtraContent}</span>],
      });
    } else {
      this.setState({
        active,
      });
    }

    React.Children.forEach(this.props.children, (child) => {
      if (
        child.type.name === 'TabPane' &&
        child.props.tabBarExtraContent &&
        active === child.key
      ) {
        this.setState({
          tabBarExtraContent: [
            <span key="1">{tabBarExtraContent}</span>,
            <span key="2">{child.props.tabBarExtraContent}</span>,
          ],
        });
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      tabBarExtraContent: [<span key="1">{nextProps.tabBarExtraContent}</span>],
    });
  }

  onTabsClick = (e, child) => {
    if (typeof this.props.onChangeTabs === 'function') {
      this.props.onChangeTabs(e, {
        index: child.index,
        disabled: child.disabled,
        label: child.disabled,
      });
    }
    if (!child.disabled) {
      this.setState({
        active: child.index,
        tabBarExtraContent: [
          <span key="1">{this.props.tabBarExtraContent}</span>,
          <span key="2">{child.tabBarExtraContent}</span>,
        ],
      });
    }
    return false;
  };

  renderChildrenJapan(props) {
    const self = this;
    self.tabPans = [];
    self.tabOthers = [];
    self.tabsk = [];
    React.Children.forEach(props.children, (child) => {
      const param = {
        index: child.key,
        label: child.props.label,
        disabled: child.props.disabled,
        tabBarExtraContent: child.props.tabBarExtraContent
          ? child.props.tabBarExtraContent
          : null,
      };
      let displays = 'none';
      let activeLi = '';

      if (this.state.active === child.key) {
        displays = 'block';
        activeLi = 'active';
      } else {
        displays = 'none';
        activeLi = '';
      }

      if (child.props.disabled) {
        activeLi = 'disabled';
      }
      this.tabPans.push(
        React.cloneElement(child, {
          label: child.props.label,
          display: displays,
          style: child.props.style,
        })
      );
      self.tabsk.push(
        <li
          key={child.key}
          className={activeLi}
          style={this.props.labelStyle}
          onClick={(e) => {
            this.onTabsClick(e, param);
          }}
        >
          {child.props.label}
        </li>
      );
    });

    if (this.state.tabBarExtraContent.length > 0) {
      self.tabsk.push(<li key="0">{this.state.tabBarExtraContent}</li>);
    } else {
      self.tabsk.push(<li style={{ width: '0', display: 'none' }} key="0" />);
    }
  }

  render() {
    this.renderChildrenJapan(this.props);

    const themeTemp = Tabs.themeColor(this.props.theme);
    return (
      <div className={`ok-tabs${themeTemp}`} style={this.props.style}>
        <ul className="tabs-label" style={this.props.tabStyle}>
          {this.tabsk}
        </ul>
        <div className="tabs-body">{this.tabPans}</div>
      </div>
    );
  }
}

Tabs.propTypes = {
  onChangeTabs: PropTypes.func,
  defaultIndexKey: PropTypes.string,
  active: PropTypes.string,
  tabBarExtraContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  theme: PropTypes.string,
  tabStyle: PropTypes.object,
  labelStyle: PropTypes.object,
};
Tabs.defaultProps = {
  onChangeTabs: undefined,
  defaultIndexKey: '1',
  active: '1',
  tabBarExtraContent: null,
  theme: '',
  tabStyle: null,
  labelStyle: null,
};

export { Tabs, TabPane };
