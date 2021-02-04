import React from 'react';
import { withRouter } from 'react-router-dom';
import ReduceLiquidity from './ReduceLiquidity';
import * as api from '../util/api';
@withRouter
export default class ReduceLiquidityWrap extends React.Component {
  constructor(props) {
    super(props)
    this.init = false;
    this.state = {
      userLiquidity:null
    }
  }

  async componentDidMount() {
    this.init = true;
    const {match:{params:{base,target}}} = this.props;
    let {userLiquidity} = await api.getLiquidity(base,target);
    this.setState({
      userLiquidity
    });
  }

  render() {
    if(!this.init) return null;
    return <ReduceLiquidity liquidity={this.state.userLiquidity}/>
  }
}
