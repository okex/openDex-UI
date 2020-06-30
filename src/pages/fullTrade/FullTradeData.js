// 全屏交易数据加载组件
import React from 'react';
import DialogSet from '../../pages/DialogSet';
import SpotTradeWrapper from '../../wrapper/SpotTradeWrapper';
import InitWrapper from '../../wrapper/InitWrapper';
import './FullTrade.less';


@InitWrapper
@SpotTradeWrapper
class FullTradeData extends React.Component {
  render() {
    return <DialogSet />;
  }
}
export default FullTradeData;
