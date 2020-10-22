import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import PageURL from '_constants/PageURL';
import ComboBox from '_src/component/ComboBox/ComboBox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SwapAction from '_src/redux/actions/SwapAction';
import './index.less';

function mapStateToProps(state) {
  const { hasSetting } = state.SwapStore;
  return {
    hasSetting,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    swapAction: bindActionCreators(SwapAction, dispatch),
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class DesktopTypeMenu extends Component {
  constructor(props) {
    super(props);
    this.headTypeList = [
      {
        url: '/derivatives/futures/full',
        type: '/derivatives/futures/full',
        label: toLocale('spot.asset.futureTrade'),
        monitor: 'full_header,nav_future,nav_enter_future',
      },
      {
        url: '/derivatives/swap/full',
        type: '/derivatives/swap/full',
        label: toLocale('spot.asset.futureswapTrade'),
        monitor: 'full_header,nav_swap,nav_enter_swap',
      },
      {
        url: '/spot/full',
        type: '/spot/full',
        label: toLocale('spot.asset.spotTrade'),
        monitor: 'full_header,nav_spot,nav_enter_spot',
      },
      {
        url: '/spot/fullMargin',
        type: '/spot/fullMargin',
        label: toLocale('spot.asset.newMarginTrade'),
        monitor: 'full_header,nav_margin,nav_enter_margin',
      },
      {
        url: `${PageURL.homePage}/spot/trade`,
        type: '/dex-test/spot/trade',
        label: toLocale('spot.asset.dexTest'),
        monitor: 'full_header,nav_dex,nav_enter_dex',
      },
      {
        url: `${PageURL.homePage}/swap`,
        type: '/dex-test/swap',
        label: toLocale('spot.asset.swap'),
        monitor: 'full_header,nav_swap,nav_enter_swap',
      },
    ];
    if (props.isDexDesk) this.headTypeList = this.headTypeList.slice(4);
  }

  change = (item) => {
    const { swapAction } = this.props;
    const hasSetting = item.url === PageURL.swapPage;
    swapAction.hasSetting(hasSetting);
  };

  render() {
    const current =
      this.headTypeList.filter((d) => d.url === this.props.current)[0] ||
      this.headTypeList[this.headTypeList.length - 1];
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

export default DesktopTypeMenu;
