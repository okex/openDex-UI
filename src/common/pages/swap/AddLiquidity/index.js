import React from 'react';
import { withRouter } from 'react-router-dom';
import AddLiquidity from './AddLiquidity';
import * as api from '../util/api';
@withRouter
export default class AddLiquidityWrap extends React.Component {
  constructor(props) {
    super(props)
    this.init = false;
    this.state = {
      liquidity:null,
      userLiquidity:null,
      disabledChangeCoin: false
    }
  }

  async componentDidMount() {
    this.init = true;
    const {match:{params:{base,target}}} = this.props;
    if(!base || !target) return this.setState({});
    let {liquidity, userLiquidity} = await api.getLiquidity(base,target);
    this.setState({
      liquidity,
      userLiquidity,
      disabledChangeCoin:!!userLiquidity
    });
  }

  render() {
    if(!this.init) return null;
    return <AddLiquidity {...this.state}/>
  }
}
