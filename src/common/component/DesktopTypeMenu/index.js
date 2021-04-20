import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { toLocale } from '_src/locale/react-locale';
import PageURL from '_constants/PageURL';
import ComboBox from '_src/component/ComboBox/ComboBox';
import './index.less';

const headTypeList = [
  {
    url: '/spot/full',
    type: '/spot/full',
    get label() {
      return toLocale('spot.asset.spotTrade');
    },
    monitor: 'full_header,nav_spot,nav_enter_spot',
  },
  {
    url: '/spot/fullMargin',
    type: '/spot/fullMargin',
    get label() {
      return toLocale('spot.asset.newMarginTrade');
    },
    monitor: 'full_header,nav_margin,nav_enter_margin',
  },
  {
    url: '/derivatives/swap/full',
    type: '/derivatives/swap/full',
    get label() {
      return toLocale('spot.asset.futureswapTrade');
    },
    monitor: 'full_header,nav_swap,nav_enter_swap',
  },
  {
    url: '/derivatives/futures/full',
    type: '/derivatives/futures/full',
    get label() {
      return toLocale('spot.asset.futureTrade');
    },
    monitor: 'full_header,nav_future,nav_enter_future',
  },
  {
    url: '/derivatives/options/instruments',
    type: '/derivatives/options/instruments',
    get label() {
      return toLocale('spot.asset.optionsTrade');
    },
    monitor: 'full_header,nav_options,nav_enter_options',
  },
  {
    url: `${PageURL.homePage}/spot/trade`,
    type: '/dex/spot/trade',
    get label() {
      return toLocale('spot.asset.dexTest');
    },
    monitor: 'full_header,nav_dex,nav_enter_dex',
    isRoute: true,
  },
  {
    url: `${PageURL.homePage}/swap`,
    type: '/dex/swap',
    get label() {
      return toLocale('spot.asset.swap');
    },
    monitor: 'full_header,nav_swap,nav_enter_swap',
    isRoute: true,
  },
  {
    url: `${PageURL.homePage}/farm`,
    type: '/dex/farm',
    get label() {
      return toLocale('spot.asset.farm');
    },
    monitor: 'full_header,nav_farm,nav_enter_farm',
    isRoute: true,
  },
];

let activedMenu = getDefaultActivedMenu(PageURL.getCurrent());

export function getDefaultActivedMenu(current) {
  return (
    headTypeList.filter((d) => current.startsWith(d.url))[0] || headTypeList[5]
  );
}

function mapStateToProps(state) {
  const { activedMenu } = state.Common;
  return { activedMenu };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class DesktopTypeMenu extends Component {
  constructor(props) {
    super(props);
    this.headTypeList = headTypeList.slice(5);
  }

  change = (item) => {
    if (item.isRoute) {
      activedMenu = item;
      this.props.commonAction.setActivedMenu(activedMenu);
    }
  };

  componentDidMount() {
    this.props.commonAction.setActivedMenu(activedMenu || '');
  }

  render() {
    const current =
      this.props.activedMenu || getDefaultActivedMenu(this.props.current);
    activedMenu = current;
    return (
      <div className="top-info-title">
        <div className="current-trade-title">
          {current.label}
          <a
            className={`down-arrow${
              this.headTypeList.length > 1 ? ' has-more' : ''
            }`}
            style={{ display: 'inline-block' }}
          />
          <div className="combo-box">
            <ComboBox
              current={current}
              comboBoxDataSource={
                this.headTypeList.length > 1 ? this.headTypeList : []
              }
              onChange={this.change}
            />
          </div>
        </div>
      </div>
    );
  }
}

Object.defineProperty(DesktopTypeMenu, 'current', {
  get() {
    return activedMenu || getDefaultActivedMenu(PageURL.getCurrent());
  },
});

export default DesktopTypeMenu;
