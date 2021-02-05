import React from 'react';
import { Link,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { bindActionCreators } from 'redux';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import { getDefaultActivedMenu } from '../../../component/DesktopTypeMenu';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class LiquidityInfoTip extends React.Component {
  goLiquidity = () => {
    const { onClose } = this.props;
    onClose();
    this.props.commonAction.setActivedMenu(
      getDefaultActivedMenu(PageURL.liquidityPage)
    );
  };

  render() {
    const { onClose, data } = this.props;
    const {lock_symbol_info:{symbols}} = data;
    const base = symbols[0];
    const quote =symbols[1];
    let url = PageURL.addLiquidityPage;
    if(base && quote) url = `${url}/${base}/${quote}`;
    return (
      <div className="stake-panel" style={{ width: '496px' }}>
        <div className="stake-panel-title no-title">
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="infotip">
            {toLocale('You didn’t have any LP tokens', {
              pool_name: data.pool_name_dis,
            })}
          </div>
        </div>
        <div className="stake-panel-footer nomargin noshadow">
          <div className="farm-btn cancel" onClick={onClose}>
            {toLocale('cancel')}
          </div>
          {/* 暂未考虑桌面端 */}
          <Link to={url} onClick={this.goLiquidity}>
            <div className="farm-btn">{toLocale('Add Liquidity')}</div>
          </Link>
        </div>
      </div>
    );
  }
}
