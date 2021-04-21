import React from 'react';
import { withRouter } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import PageURL from '_constants/PageURL';
import * as api from './util/api';
import InfoItem from './InfoItem';
import Tooltip from '../../component/Tooltip';

@withRouter
export default class PoolPanel extends React.Component {
  constructor() {
    super();
    this.init = false;
    this.state = {
      userLiquidityInfo: [],
    };
  }

  async getLiquidityInfo() {
    const userLiquidityInfo = await api.liquidityInfo();
    userLiquidityInfo && this.setState({ userLiquidityInfo });
  }

  liquidity(userLiquidityInfo = []) {
    return userLiquidityInfo.map((d, index) => (
      <InfoItem key={index} data={d} add={this.add} reduce={this.reduce} />
    ));
  }

  componentDidMount() {
    this.init = true;
    this.getLiquidityInfo();
  }

  add = async (userLiquidity) => {
    let route;
    if (!userLiquidity) route = PageURL.addLiquidityPage;
    else
      route = `${PageURL.addLiquidityPage}/${userLiquidity.base_pooled_coin.denom}/${userLiquidity.quote_pooled_coin.denom}`;
    this.props.history.push(route);
  };

  create = () => {
    this.props.history.push(PageURL.createLiquidityPage);
  };

  reduce = (liquidity) => {
    this.props.history.push(
      `${PageURL.reduceLiquidityPage}/${liquidity.base_pooled_coin.denom}/${liquidity.quote_pooled_coin.denom}`
    );
  };

  render() {
    const { userLiquidityInfo } = this.state;
    return (
      <div className="panel panel-pool">
        <div className="btn add-icon" onClick={() => this.add()}>
          {toLocale('Add Liquidity')}
        </div>
        <div className="liquidity">
          <div className="left">
            {toLocale('Your Liquidity')}
            <Tooltip
              placement="right"
              overlay={toLocale("It's your current liquidity in the pool.")}
            >
              <i className="help" />
            </Tooltip>
          </div>
          <div className="right" onClick={this.create}>
            {toLocale('Create Liquidity')}
          </div>
        </div>
        {this.init && !!userLiquidityInfo.length && (
          <div className="poll-items-wrap">
            <div className="poll-items">
              {this.liquidity(userLiquidityInfo)}
            </div>
          </div>
        )}
        {this.init && !userLiquidityInfo.length && (
          <div className="nodata">{toLocale('No Liquidity Found')}</div>
        )}
      </div>
    );
  }
}
