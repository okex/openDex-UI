import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import * as PoolAction from '_src/redux/actions/PoolAction';
import * as api from '../util/api';
import InfoItem from './InfoItem';
import AddLiquidity from '../AddLiquidity';
import CreateLiquidity from '../CreatLiquidity';
import ReduceLiquidity from '../ReduceLiquidity';

function mapStateToProps(state) {
  const { liquidityInfo } = state.PoolStore;
  return { liquidityInfo };
}

function mapDispatchToProps(dispatch) {
  return {
    poolAction: bindActionCreators(PoolAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class LiquidityInfo extends React.Component {

  constructor() {
    super();
    this.init = false;
  }

  async getLiquidityInfo() {
    const liquidityInfo = await api.liquidityInfo();
    this.props.poolAction.liquidityInfo(liquidityInfo);
  }

  liquidity(liquidityInfo = []) {
    return liquidityInfo.map((d, index) => <InfoItem key={index} data={d} add={this.add} reduce={this.reduce} />)
  }

  componentDidMount() {
    this.init = true;
    this.getLiquidityInfo();
  }

  add = (liquidity) => {
    this.props.push({
      component:AddLiquidity,
      props:{
        liquidity
      }
    })
  }

  create = () => {
    this.props.push({
      component:CreateLiquidity
    })
  }

  reduce = (liquidity) => {
    this.props.push({
      component:ReduceLiquidity,
      props:{
        liquidity
      }
    })
  }

  render() {
    const { liquidityInfo } = this.props;
    return (
      <div className="panel panel-pool">
        <div className="btn add-icon" onClick={() => this.add()}>{toLocale('Add Liquidity')}</div>
        <div className="liquidity">
          <div className="left">{toLocale('Your Liquidity')}</div>
          <div className="right" onClick={this.create}>{toLocale('Create Liquidity')}</div>
        </div>
        {this.init && liquidityInfo.length ?
          <div className="poll-items-wrap">
            <div className="poll-items">
              {this.liquidity(liquidityInfo)}
            </div>
          </div> : <div className="nodata">
            {toLocale('No Liquidity Found')}
          </div>
        }
      </div>
    );
  }
}
