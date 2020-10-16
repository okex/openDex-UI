import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import * as api from './util/api';
import InfoItem from './InfoItem';
import AddLiquidity from './AddLiquidity';
import CreateLiquidity from './CreatLiquidity';
import ReduceLiquidity from './ReduceLiquidity';

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
    this.setState({ userLiquidityInfo });
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

  add = async userLiquidity => {
    if(!userLiquidity) return this.goAddLiquidity();
    const liquidity = await api.tokenPair({base_token:userLiquidity.base_pooled_coin.denom,quote_token:userLiquidity.quote_pooled_coin.denom})
    this.goAddLiquidity({liquidity,userLiquidity});
  };

  goAddLiquidity(data={}) {
    const {liquidity,userLiquidity} = data;
    this.props.push({
      component: AddLiquidity,
      props: {
        liquidity,
        userLiquidity,
        disabledChangeCoin: !!userLiquidity,
      },
    });
  }

  create = () => {
    this.props.push({
      component: CreateLiquidity,
    });
  };

  reduce = (liquidity) => {
    this.props.push({
      component: ReduceLiquidity,
      props: {
        liquidity,
      },
    });
  };

  render() {
    const { userLiquidityInfo } = this.state;
    return (
      <div className="panel panel-pool">
        <div className="btn add-icon" onClick={() => this.add()}>
          {toLocale('Add Liquidity')}
        </div>
        <div className="liquidity">
          <div className="left">{toLocale('Your Liquidity')}</div>
          <div className="right" onClick={this.create}>
            {toLocale('Create Liquidity')}
          </div>
        </div>
        {this.init && userLiquidityInfo.length ? (
          <div className="poll-items-wrap">
            <div className="poll-items">{this.liquidity(userLiquidityInfo)}</div>
          </div>
        ) : (
          <div className="nodata">{toLocale('No Liquidity Found')}</div>
        )}
      </div>
    );
  }
}
