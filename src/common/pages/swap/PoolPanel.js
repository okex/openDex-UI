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
      liquidityInfo: [],
    };
  }

  async getLiquidityInfo() {
    const liquidityInfo = await api.liquidityInfo();
    this.setState({ liquidityInfo });
  }

  liquidity(liquidityInfo = []) {
    return liquidityInfo.map((d, index) => (
      <InfoItem key={index} data={d} add={this.add} reduce={this.reduce} />
    ));
  }

  componentDidMount() {
    this.init = true;
    this.getLiquidityInfo();
  }

  add = (liquidity) => {
    this.props.push({
      component: AddLiquidity,
      props: {
        liquidity,
        showLiquidity: false,
        disabledChangeCoin: !!liquidity,
      },
    });
  };

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
    const { liquidityInfo } = this.state;
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
        {this.init && liquidityInfo.length ? (
          <div className="poll-items-wrap">
            <div className="poll-items">{this.liquidity(liquidityInfo)}</div>
          </div>
        ) : (
          <div className="nodata">{toLocale('No Liquidity Found')}</div>
        )}
      </div>
    );
  }
}
